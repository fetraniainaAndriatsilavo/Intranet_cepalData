<?php

namespace App\Http\Controllers;

use App\Models\DocType;
use App\Models\DocumentAdmin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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
                'status' => 'required',
                'period' => 'nullable|integer',
                'file_path' => 'required|file|mimes:pdf,jpg,png,docx,doc',
            ]);

            $fileUrl = null;


            if ($request->hasFile('file_path')) {
                $file = $request->file('file_path');

                $filename = uniqid() . '_' . $file->getClientOriginalName();
                $directory = 'images/document';

                $storedPath = $file->storeAs($directory, $filename, 'sftp');

                if (!$storedPath) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Échec de l\'upload du fichier.',
                    ], 500);
                }

                $fileUrl = 'https://57.128.116.184/intranet/' . $storedPath;

                DB::table('intranet_extedim.documents_admin')->insert([
                    'user_id' => $validated['user_id'],
                    'file_name' => $validated['file_name'],
                    'doct_type_id' => $validated['doct_type_id'],
                    'period' => $validated['period'],
                    'status' => $validated['status'],
                    'file_path' => $fileUrl,
                    'uploaded_by' => $validated['uploaded_by'],
                    'uploaded_at' => now(),
                    'is_public' => true
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
            ], 500);
        }
    }

    public function getUserDocuments($userId)
    {

        $documents = DocumentAdmin::where('user_id', $userId)->get();

        if ($documents->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun document trouvé pour cet utilisateur.',
            ], 404);
        }

        return response()->json($documents);
    }
}
