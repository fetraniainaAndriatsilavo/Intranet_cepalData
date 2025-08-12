<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'user_id' => 'required|exists:users,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif,bmp',
            'content' => 'required|string',
            'status' => 'required|in:deleted,pending,published',
            'likes_count' => 'nullable|integer|min:0',
            'comment_count' => 'nullable|integer|min:0',
            'group_id' => 'nullable|exists:groups,id',
            'deleted_by' => 'nullable|exists:users,id',
            'attachments.*' => 'file|mimes:jpg,jpeg,png,gif,bmp,pdf,doc,docx,zip',
        ];
    }


    public function messages()
    {
        return [
            'user_id.required' => 'L\'identifiant de l\'utilisateur est requis.',
            'user_id.exists' => 'L\'utilisateur sélectionné est invalide.',
            'image.image' => 'Le fichier doit être une image.',
            'image.max' => 'L\'image ne doit pas dépasser 2 Mo.',
            'status.required' => 'Le statut est obligatoire.',
            'status.in' => 'Le statut doit être soit "draft" soit "published".',
            'group_id.exists' => 'Le groupe sélectionné est invalide.',
            'attachments.*.file' => 'Chaque pièce jointe doit être un fichier valide.',
            'attachments.*.max' => 'Chaque fichier ne doit pas dépasser 5 Mo.',
        ];
    }
}
