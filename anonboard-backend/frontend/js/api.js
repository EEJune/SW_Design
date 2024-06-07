const apiUrl = 'http://localhost:5000/api';
async function register(username, email, password) {
    const res = await fetch(`${apiUrl}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    });
    return res.json();
}

async function login(email, password) {
    const res = await fetch(`${apiUrl}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    return res.json();
}

async function createPost(token, title, content, isAnonymous) {
    const res = await fetch(`${apiUrl}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content, isAnonymous })
    });
    if (!res.ok) {
        const error = await res.json();
        console.error('Error creating post:', error);
        throw new Error(error.error || 'Failed to create post');
    }
    return res.json();
}

async function createComment(token, postId, content, isAnonymous) {
    const res = await fetch(`${apiUrl}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ postId, content, isAnonymous })
    });
    if (!res.ok) {
        const error = await res.json();
        console.error('Error creating comment:', error);
        throw new Error(error.error || 'Failed to create comment');
    }
    return res.json();
}

async function deletePost(token, postId) {
    const res = await fetch(`${apiUrl}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) {
        const error = await res.json();
        console.error('Error deleting post:', error);
        throw new Error(error.error || 'Failed to delete post');
    }
    return res.json();
}

async function deleteComment(token, commentId) {
    const res = await fetch(`${apiUrl}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) {
        const error = await res.json();
        console.error('Error deleting comment:', error);
        throw new Error(error.error || 'Failed to delete comment');
    }
    return res.json();
}

async function getPosts() {
    const res = await fetch(`${apiUrl}/posts`);
    if (!res.ok) {
        const error = await res.json();
        console.error('Error fetching posts:', error);
        throw new Error(error.error || 'Failed to fetch posts');
    }
    return res.json();
}

async function getComments(postId) {
    const res = await fetch(`${apiUrl}/comments/${postId}`);
    if (!res.ok) {
        const error = await res.json();
        console.error('Error fetching comments:', error);
        throw new Error(error.error || 'Failed to fetch comments');
    }
    return res.json();
}
