document.addEventListener('DOMContentLoaded', () => {
    const mainContentDiv = document.getElementById('main-content');
    const registerBtn = document.getElementById('register-btn');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    registerBtn.addEventListener('click', showRegisterForm);
    loginBtn.addEventListener('click', showLoginForm);
    logoutBtn.addEventListener('click', logout);

    async function showRegisterForm() {
        mainContentDiv.innerHTML = `
            <h1>Register</h1>
            <form id="register-form">
                <input type="text" class="form-control" id="register-username" placeholder="Username" required />
                <input type="email" class="form-control" id="register-email" placeholder="Email" required />
                <input type="password" class="form-control" id="register-password" placeholder="Password" required />
                <button type="submit">Register</button>
            </form>
        `;

        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            try {
                const result = await register(username, email, password);
                if (result._id) {
                    alert('Registration successful');
                    showLoginForm();
                } else {
                    alert('Registration failed');
                }
            } catch (err) {
                console.error('Error during registration:', err);
                alert('Registration failed');
            }
        });
    }
    
    async function showLoginForm() {
        mainContentDiv.innerHTML = `
            <img src="../img/You&me.jpg" alt="Logo" class="logo">
            <h1>Login</h1>
            <form id="login-form">
                <input type="email" class="form-control" id="login-email" placeholder="Email" required />
                <input type="password" class="form-control" id="login-password" placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
        `;

        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            try {
                const result = await login(email, password);
                if (result.token) {
                    localStorage.setItem('token', result.token);
                    alert('Login successful');
                    showPostList();
                } else {
                    alert('Login failed');
                }
            } catch (err) {
                console.error('Error during login:', err);
                alert('Login failed');
            }
        });
    }

    function logout() {
        localStorage.removeItem('token');
        alert('Logged out');
        showLoginForm();
    }

    async function showPostList() {
        try {
            const posts = await getPosts();
            mainContentDiv.innerHTML = `
                <img src="../img/You&me.jpg" alt="Logo" class="logo">
                <h2>Posts</h2>
                <button id="create-post-btn" class="btn btn-outline-success">Create Post</button>
                <ul id="post-list" class="list-group list-group-flush ">
                ${posts.map(post => `
                    <li class="list-group-item d-flex justify-content-between align-items-center border border-info">
                        <span>${post.isAnonymous ? 'Anonymous' : post.author.username}: ${post.title}</span>
                        <div>
                            <button class="view-post-btn btn btn-outline-info" data-id="${post._id}">View</button>
                            <button class="delete-post-btn btn btn-outline-danger" data-id="${post._id}">Delete</button>
                        </div>
                    </li>
                `).join('')}
                </ul>
            `;

            document.getElementById('create-post-btn').addEventListener('click', showCreatePostForm);

            document.querySelectorAll('.view-post-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    showPostDetail(e.target.getAttribute('data-id'));
                });
            });

            document.querySelectorAll('.delete-post-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const postId = e.target.getAttribute('data-id');
                    const token = localStorage.getItem('token');
                    try {
                        const result = await deletePost(token, postId);
                        if (result.message === 'Post deleted') {
                            alert('Post deleted');
                            showPostList();
                        } else {
                            alert('Failed to delete post');
                        }
                    } catch (err) {
                        console.error('Error deleting post:', err);
                        alert('Failed to delete post');
                    }
                });
            });
        } catch (err) {
            console.error('Error fetching posts:', err);
            alert('Failed to load posts');
        }
    }

    async function showCreatePostForm() {
        mainContentDiv.innerHTML = `
            <img src="../img/You&me.jpg" alt="Logo" class="logo">
            <h2>Create Post</h2>
            <button id="back-to-list-btn" class="btn btn-outline-dark">Back to list</button>
            <form id="create-post-form">
                <input type="text" id="create-post-title" class="border border-danger" placeholder="Title" required />
                <textarea id="create-post-content" class="border border-info" placeholder="Content" required></textarea>
                <label>
                    <input type="checkbox" id="create-post-isAnonymous" />
                    Post anonymously
                </label>
                <button type="submit">Create</button>
            </form>
        `;
        document.getElementById('back-to-list-btn').addEventListener('click', showPostList);
        document.getElementById('create-post-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('token');
            const title = document.getElementById('create-post-title').value;
            const content = document.getElementById('create-post-content').value.trim();
            const isAnonymous = document.getElementById('create-post-isAnonymous').checked;

            console.log('Title:', title);
            console.log('Content:', content);
            console.log('Is Anonymous:', isAnonymous);

            try {
                const result = await createPost(token, title, content, isAnonymous);
                if (result._id) {
                    alert('Post created');
                    showPostList();
                } else {
                    alert('Post creation failed');
                }
            } catch (err) {
                console.error('Error creating post:', err);
                alert('Post creation failed');
            }
        });
    }

    async function showPostDetail(postId) {
        try {
            const posts = await getPosts();
            const post = posts.find(p => p._id === postId);
            const comments = await getComments(postId);

            mainContentDiv.innerHTML = `
                <img src="../img/You&me.jpg" alt="Logo" class="logo">
                <h2>Post Detail</h2>
                <h3>${post.title}</h3>
                <p class="styled-paragraph border border-info">${post.content}</p>
                <button id="back-to-list-btn" class="btn btn-outline-dark">Back to list</button>
                <h3>Comments</h3>
                <ul id="comment-list">
                    ${comments.map(comment => `
                        <li>
                            ${comment.isAnonymous ? 'Anonymous' : comment.author.username}: ${comment.content}
                            <button class="delete-comment-btn btn btn-outline-danger small-btn" data-id="${comment._id}">Delete</button>
                        </li>
                    `).join('')}
                </ul>
                <form id="create-comment-form">
                    <textarea id="create-comment-content" placeholder="Add a comment" required></textarea>
                    <label>
                        <input type="checkbox" id="create-comment-isAnonymous" />
                        Comment anonymously
                    </label>
                    <button type="submit">Add Comment</button>
                </form>
            `;

            document.getElementById('back-to-list-btn').addEventListener('click', showPostList);

            document.getElementById('create-comment-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const token = localStorage.getItem('token');
                const content = document.getElementById('create-comment-content').value;
                const isAnonymous = document.getElementById('create-comment-isAnonymous').checked;

                console.log('Comment Content:', content);
                console.log('Is Anonymous:', isAnonymous);

                try {
                    const result = await createComment(token, postId, content, isAnonymous);
                    if (result._id) {
                        alert('Comment added');
                        showPostDetail(postId);
                    } else {
                        alert('Comment creation failed');
                    }
                } catch (err) {
                    console.error('Error creating comment:', err);
                    alert('Comment creation failed');
                }
            });

            document.querySelectorAll('.delete-comment-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const commentId = e.target.getAttribute('data-id');
                    const token = localStorage.getItem('token');
                    try {
                        const result = await deleteComment(token, commentId);
                        if (result.message === 'Comment deleted') {
                            alert('Comment deleted');
                            showPostDetail(postId);
                        } else {
                            alert('Failed to delete comment');
                        }
                    } catch (err) {
                        console.error('Error deleting comment:', err);
                        alert('Failed to delete comment');
                    }
                });
            });
        } catch (err) {
            console.error('Error fetching post details:', err);
            alert('Failed to load post details');
        }
    }

    if (localStorage.getItem('token')) {
        showPostList();
    } else {
        showLoginForm();
    }
});
