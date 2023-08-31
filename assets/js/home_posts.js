$(document).ready(function(){
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(), //converts the post form data into json
                success: function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    newPost.find(' .user-name').text(`~${data.data.post.user.name}`);
                    deletePost(newPost.find('.delete-post-button'));

                    let postComments =  $(`#post-${data.data.post._id}-comments-form`);
                    createComment(postComments, data.data.post._id);

                    new ToggleLike($(' .toggle-like-button', newPost));

                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                }, error: function (err){
                    console.log(err.responseText);
                }
            });
        });
    }

    // Create a POST in DOM
    let newPostDom = function(post){
        return $(`
<li id="post-${post._id}">
    <p>
            <small>
            <a class="delete-post-button" href="/posts/destroy/${post._id}">x</a>
        </small>

        ${post.content}
        <br>
        <i><small class="user-name">
        ~${post.user.name}
        </small></i>

        <small>
                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}>&type=Post">
                    0 Likes
                </a>
        </small>
    </p>
    <div class="post-comments">
            <form id="post-${post._id}-comments-form" action="/comments/create"  method="POST">
                <input type="text" name="content" placeholder="Type here to add comment..." required>
                <input type="hidden" name="post" value="${post._id}">
                <input type="submit" value="Add Comment">
            </form>

        <div class="post-comments-list">
            <ul id="post-comments-${post._id}">

            </ul>
        </div>
    </div>
</li>
        `)
    }


    // method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }
    

    

    // creates comment dynamically
    let createComment = function(commentForm, postId){
        commentForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: commentForm.serialize(),
                success: function(data){
                    let newComment = newCommentDom(data.data.comment);
                    $(`#post-comments-${postId}`).prepend(newComment);
                    newComment.find(' .comm-user-name').text(data.data.comment.user.name);
                    deleteComment($(' .delete-comment-button'), newComment);

                    new ToggleLike($(' .toggle-like-button', newComment));

                }, error: function(err){
                    console.log(err.responseText);
                }
            });
        });
    }

    let newCommentDom = function(comment){
        return $(`
        <li id="comment-${comment._id}">
        <p>
            <small>
                <a class="delete-comment-button" href="/comments/destroy/${comment._id}">x</a>
            </small>
            ${comment.content} 
            <br>
            <small class="comm-user-name"><i>
                ~${comment.user.name}
            </i></small>

            <small>
                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}>&type=Post">
                    0 Likes
                </a>
            </small>
        </p>
        </li>
        `)
    }

    let deleteComment = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();
                }, error: function(err){
                    console.log(err.responseText);
                }
            });
        });
    }

    createPost();
});