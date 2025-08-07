<?php

namespace App\Http\Controllers;

use App\Models\TimesheetPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PeriodeController extends Controller
{


    public function store(Request $request)
    {
        try {
            $messages = [
                'periode.required' => 'Le champ période est obligatoire.',
                'periode.string' => 'Le champ période doit être une chaîne de caractères.',
                'periode.max' => 'Le champ période ne doit pas dépasser 255 caractères.',

                'start_date.date' => 'Le champ date de début doit être une date valide.',
                'end_date.date' => 'Le champ date de fin doit être une date valide.',
                'end_date.after_or_equal' => 'La date de fin doit être postérieure ou égale à la date de début.',
                'status.string' => 'Le champ statut doit être une chaîne de caractères.',
            ];

            $validated = $request->validate([
                'periode' => 'required|string|max:255',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'status' => 'nullable|string',
            ], $messages);

            $TimesheetPeriod = TimesheetPeriod::create($validated);

            return response()->json([
                'data' => $TimesheetPeriod,
                'message' => 'Session créée avec succès',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur interne',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }



    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'updated_by' => 'required|exists:intranet_extedim.users,id',
            'TimesheetPeriod' => 'sometimes|required|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'nullable|string',
        ]);

        $timesheetPeriod = TimesheetPeriod::findOrFail($id);

        $validated['updated_by'] = Auth::id();
        $timesheetPeriod->update($validated);

        return response()->json($timesheetPeriod);
    }


    public function destroy(int $id)
    {
        $timesheetPeriod = TimesheetPeriod::findOrFail($id);
        $timesheetPeriod->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }

    public function getAll()
    {
        $timesheetPeriods = TimesheetPeriod::all();

        return response()->json($timesheetPeriods);
    }
}
