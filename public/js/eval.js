let currentBoard = 1;
const postList = document.getElementById('postList');
const postModal = document.getElementById('postModal');
const commentModal = document.getElementById('commentModal');
const contentModal = document.getElementById('contentModal');
const postContentDiv = document.getElementById('postContent');
const postForm = document.getElementById('postForm');
const commentForm = document.getElementById('commentForm');
let editingPost = null;
let selectedPostIndex = null;

function navigateToBoard(boardNumber) {
    currentBoard = boardNumber;
    document.querySelector('h2').textContent = `${boardNumber}번 식당 평가`;
    loadPosts();
}

document.getElementById('newPostBtn').onclick = function () {
    postModal.style.display = 'block';
    postForm.reset();
    editingPost = null;
};

function closeModal() {
    postModal.style.display = 'none';
}

postForm.onsubmit = function (event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const recommend = document.querySelector('input[name="recommend"]:checked').value;
    const rating = document.querySelector('input[name="rating"]:checked').value;

    const post = { title, content, recommend, rating, board: currentBoard, comments: [], likes: 0 };

    if (editingPost !== null) {
        updatePost(editingPost, post);
    } else {
        savePost(post);
    }

    closeModal();
    loadPosts();
};

function savePost(post) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));
}

function loadPosts() {
    postList.innerHTML = '';
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts = posts.filter(post => post.board === currentBoard);
    
    // 인기순 정렬
    posts.sort((a, b) => b.likes - a.likes);

    posts.forEach((post, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${post.title} (${post.recommend})</strong><br>
            <button onclick="showContent(${index})">글의 내용</button>
            <button onclick="likePost(${index})">좋아요 (${post.likes})</button>
            <button onclick="openCommentModal(${index})">댓글 보기</button>
            <button onclick="deletePost(${index})">삭제</button>
        `;
        postList.appendChild(li);
    });
}

function sortPosts() {
    loadPosts();
}

function deletePost(index) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    const filteredPosts = posts.filter(post => post.board === currentBoard);
    const globalIndex = posts.indexOf(filteredPosts[index]);

    if (globalIndex !== -1) {
        posts.splice(globalIndex, 1);
        localStorage.setItem('posts', JSON.stringify(posts));
        loadPosts();
    }
}

function showContent(index) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts[index];

    postContentDiv.textContent = post.content;
    contentModal.style.display = 'block';
}

function closeContentModal() {
    contentModal.style.display = 'none';
}

function likePost(index) {
    let posts = JSON.parse(localStorage.getItem('posts'));
    posts[index].likes += 1;
    localStorage.setItem('posts', JSON.stringify(posts));
    loadPosts();
}

function openCommentModal(index) {
    selectedPostIndex = index;
    commentModal.style.display = 'block';
    loadComments();
}

function closeCommentModal() {
    commentModal.style.display = 'none';
}

commentForm.onsubmit = function (event) {
    event.preventDefault();
    const comment = document.getElementById('commentInput').value;
    const posts = JSON.parse(localStorage.getItem('posts'));
    posts[selectedPostIndex].comments.push(comment);
    localStorage.setItem('posts', JSON.stringify(posts));
    loadComments();
    commentForm.reset();
};

function loadComments() {
    const posts = JSON.parse(localStorage.getItem('posts'));
    const commentsDiv = document.getElementById('comments');
    commentsDiv.innerHTML = posts[selectedPostIndex].comments.map(c => `<p>${c}</p>`).join('');
}

window.onload = loadPosts;