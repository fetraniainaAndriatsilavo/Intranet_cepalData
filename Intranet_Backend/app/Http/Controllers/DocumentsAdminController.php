<?php

namespace App\Http\Controllers;

use App\Models\DocType;
use App\Models\DocumentAdmin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;


class DocumentsAdminController extends Controller
{
    public function doc_type()
    {
        $doc_type = DocType::all();
        return response()->json($doc_type);
    }

    public function upload(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'nullable|integer',
                'file_name' => 'required|string',
                'doct_type_id' => 'required|string',
                'uploaded_by' => 'nullable|integer',
                'description' => 'nullable|string',
                'is_public' => 'nullable|in:true,false,1,0',
                'period' => 'nullable|integer',
                'file_path' => 'required|file|mimes:pdf,jpg,png,docx,doc',
            ], [
                'user_id.integer' => 'Le champ utilisateur doit être un nombre entier.',
                'file_name.required' => 'Le nom du fichier est obligatoire.',
                'file_name.string' => 'Le nom du fichier doit être une chaîne de caractères.',
                'doct_type_id.required' => 'Le type de document est obligatoire.',
                'doct_type_id.string' => 'Le type de document doit être une chaîne de caractères.',
                'uploaded_by.integer' => 'Le champ "uploadé par" doit être un nombre entier.',
                'description.string' => 'La description doit être une chaîne de caractères.',
                'is_public.in' => 'Le champ "public" doit être vrai ou faux.',
                'period.integer' => 'La période doit être un nombre entier.',
                'file_path.required' => 'Un fichier est requis.',
                'file_path.file' => 'Le fichier doit être valide.',
                'file_path.mimes' => 'Le fichier doit être de type : pdf, jpg, png, docx ou doc.',
            ]);


            $fileUrl = null;

            if ($request->hasFile('file_path')) {
                $file = $request->file('file_path');

                $userId = $validated['user_id'] ?? null;
                $originalName = $file->getClientOriginalName();
                $extension = $file->getClientOriginalExtension();

                $baseName = pathinfo($originalName, PATHINFO_FILENAME);
                $dateSuffix = now()->format('Y-m-d_H-i-s');

                $filename = $baseName . '_' . $dateSuffix . '.' . $extension;

                if ($userId) {
                    $directory = "users/{$userId}/documents_admin";
                } else {
                    $directory = "documents/public";
                }

                $disk = Storage::disk('sftp');

                if (!$disk->exists($directory)) {
                    $disk->makeDirectory($directory);
                }

                $storedPath = $file->storeAs($directory, $filename, 'sftp');

                if (!$storedPath) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Échec de l\'upload du fichier.',
                    ], 500);
                }

                $fileUrl = 'https://57.128.116.184/intranet/' . $storedPath;

                DocumentAdmin::create([
                    'user_id' => $userId,
                    'file_name' => $validated['file_name'],
                    'doct_type_id' => $validated['doct_type_id'],
                    'period' => $validated['period'] ?? NULL,
                    'status' => "active",
                    'file_path' => $fileUrl,
                    'is_public' => $validated['is_public'],
                    'uploaded_by' => $validated['uploaded_by'],
                    'uploaded_at' => now(),
                    'description' => $validated['description'] ?? null,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Document enregistré avec succès.',
                    'file_path' => $fileUrl,
                ], 201);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Aucun fichier n’a été fourni.',
                ], 400);
            }
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'upload du document : ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de l’enregistrement.',
                'error' => $e->getMessage(),
            ],  500);
        }
    }


    public function changeStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:inactive,active',
        ], [
            'status.required' => 'Le statut est requis.',
        ]);

        $document = DocumentAdmin::find($id);

        if (!$document) {
            return response()->json(['message' => 'Document introuvable.'], 404);
        }

        $document->status = $request->status;
        $document->save();


        return response()->json([
            'message' => "Document mise à jour avec succès en tant que {$request->status}.",
            'data' => $document
        ]);
    }

    public function getUserDocuments($userId)
    {
        $publicDocs = DocumentAdmin::where('is_public', true)
            ->where('status', 'active')
            ->with(['type', 'uploadedBy:id,first_name,last_name'])
            ->get();

        $privateDocs = DocumentAdmin::where('user_id', $userId)
            ->where('status', 'active')
            ->with(['type', 'uploadedBy:id,first_name,last_name'])
            ->get();

        if ($publicDocs->isEmpty() && $privateDocs->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun document trouvé (public ou privé) actif dans les 6 derniers mois.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'public' => $publicDocs,
            'privee' => $privateDocs,
        ]);
    }
}
