<?php

namespace App\Http\Controllers;

use App\Models\PayrollRecord;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class PayrollRecordController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'employee_id' => 'nullable|integer',
                'period' => 'required|string',
                'file' => 'required|file|max:51200',
                'uploaded_by' => 'nullable|integer',
            ]);

            if (!is_null($validated['employee_id']) && !User::find($validated['employee_id'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'L\'employé spécifié n\'existe pas.',
                ], 404);
            }

            if (!is_null($validated['uploaded_by']) && !User::find($validated['uploaded_by'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'L\'utilisateur ayant uploadé le fichier n\'existe pas.',
                ], 404);
            }

            $fileUrl = null;

            if ($request->hasFile('file')) {
                $file = $request->file('file');

                $filename = uniqid() . '_' . $file->getClientOriginalName();
                $directory = 'images/payroll';

                $storedPath = $file->storeAs($directory, $filename, 'sftp');

                if (!$storedPath) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Échec de l\'upload du fichier.',
                    ], 500);
                }

                $fileUrl = 'https://57.128.116.184/intranet/' . $storedPath;
            }

            $payrollRecord = PayrollRecord::create([
                'employee_id' => $validated['employee_id'],
                'period' => $validated['period'],
                'file_url' => $fileUrl,
                'uploaded_by' => $validated['uploaded_by'],
                'status' => 'active',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Enregistrement réussi.',
                'data' => $payrollRecord
            ], 201);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création du payroll record: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de l\'enregistrement.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



    public function getUserPayroll($userId)
    {
        $payrolls = PayrollRecord::where('employee_id', $userId)->get();

        if ($payrolls->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun fiche trouvé pour cet utilisateur.',
            ], 404);
        } else {
            return response()->json($payrolls);
        }
    }
}
