<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use App\Http\Requests\StorePostRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    public function postAll()
    {
        $allPosts = Post::with('attachments')->get();

        return response()->json([
            'success' => true,
            'posts' => $allPosts,
        ], 200);
    }

    public function getPublishedPosts()
    {
        try {
            $publishedPosts = Post::published()
                ->with('attachments')
                ->get();

            return response()->json([
                'success' => true,
                'posts' => $publishedPosts,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des posts publiés avec leurs attachements.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|exists:intranet_extedim.users,id',
                'status' => 'required|in:deleted,pending,published',
                'content' => 'nullable|string',
                'group_id' => 'nullable|exists:intranet_extedim.groups,id',
                'attachments.*' => 'nullable|file|max:5120',
            ], [
                'user_id.required' => 'L\'utilisateur est obligatoire.',
                'user_id.exists' => 'L\'utilisateur sélectionné est invalide.',
                'status.required' => 'Le statut est requis.',
                'status.in' => 'Le statut doit être "draft" ou "published".',
                'content.string' => 'Le contenu doit être une chaîne de caractères.',
                'group_id.exists' => 'Le groupe sélectionné n\'existe pas.',
                'attachments.*.file' => 'Chaque pièce jointe doit être un fichier valide.',
                'attachments.*.max' => 'Chaque fichier ne doit pas dépasser 5 Mo.',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Des erreurs de validation sont survenues.',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            $post = Post::create($data);

            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $extension = $file->getClientOriginalExtension();
                    $filename = 'post_' . now()->timestamp . '_' . uniqid() . '.' . $extension;
                    $directory = 'post_images/' . $post->user_id;

                    $isImage = in_array(strtolower($extension), ['jpg', 'jpeg', 'png', 'gif', 'bmp']);

                    if ($isImage) {
                        $mimeType = $file->getClientMimeType();
                        if (!str_starts_with($mimeType, 'image/')) {
                            return response()->json([
                                'success' => false,
                                'message' => 'Le fichier "' . $file->getClientOriginalName() . '" n\'est pas une image valide.',
                            ], 400);
                        }
                    }

                    $storedPath = $file->storeAs($directory, $filename, 'sftp');

                    if (!$storedPath) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Échec de l\'upload du fichier "' . $file->getClientOriginalName() . '".',
                        ], 500);
                    }

                    $fileUrl = 'https://57.128.116.184/intranet/' . $storedPath;

                    $post->attachments()->create([
                        'file_path' => $fileUrl,
                        'is_image' => $isImage,
                    ]);
                }
            }

            return response()->json($post->load('attachments'), 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur interne lors de la création du post.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $postId)
    {
        try {
            $post = Post::withTrashed()->findOrFail($postId);


            $validatedData = $request->validate([
                'content' => 'nullable|string',
                'status' => 'nullable|in:published,draft,archived',
                'likes_count' => 'nullable|integer|min:0',
                'comment_count' => 'nullable|integer|min:0',
                'group_id' => 'nullable|exists:intranet_extedimgroups,id',
                'deleted_by' => 'nullable|exists:intranet_extedim.users,id',
                'attachments.*' => 'file|mimes:jpg,jpeg,png,gif,bmp,pdf,doc,docx,zip',
            ]);

            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $extension = $file->getClientOriginalExtension();
                    $filename = 'post_' . now()->timestamp . '_' . uniqid() . '.' . $extension;
                    $directory = 'post_images/' . $post->user_id;

                    $isImage = in_array(strtolower($extension), ['jpg', 'jpeg', 'png', 'gif', 'bmp']);

                    if ($isImage) {
                        $mimeType = $file->getClientMimeType();
                        if (!str_starts_with($mimeType, 'image/')) {
                            return response()->json([
                                'success' => false,
                                'message' => 'Le fichier "' . $file->getClientOriginalName() . '" n\'est pas une image valide.',
                            ], 400);
                        }
                    }

                    $storedPath = $file->storeAs($directory, $filename, 'sftp');

                    if (!$storedPath) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Échec de l\'upload du fichier "' . $file->getClientOriginalName() . '".',
                        ], 500);
                    }

                    $fileUrl = 'https://57.128.116.184/intranet/' . $storedPath;

                    $post->attachments()->create([
                        'file_path' => $fileUrl,
                        'is_image' => $isImage,
                    ]);
                }
            }

            $post->update($validatedData);

            return response()->json($post->load('attachments'), 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation échouée.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la mise à jour du post.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($postId)
    {
        try {
            $post = Post::withTrashed()->findOrFail($postId);


            $post->status = 'deleted';
            $post->save();

            return response()->json([
                'success' => true,
                'message' => 'Le post a été marqué comme supprimé.',
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Post introuvable.',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression logique du post.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
