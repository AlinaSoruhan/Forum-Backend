let posts = [
    {
        id: 1,
        title: "Node.js",
        content: "TS",
        author: "olga",
        category: "IT"
    },
    {
        id: 2,
        title: "api",
        content: "api use",
        author: "sam",
        category: "IT"
    },
    {
        id: 3,
        title: "3",
        content: "3",
        author: "max",
        category: "number"
    }
];

export function getAll(category, take) {
    let result = [...posts];

    if (category) {
        result = result.filter(
            (post) => post.category.toLowerCase() === category.toLowerCase()
        );
    }

    if (take !== undefined) {
        result = result.slice(0, take);
    }

    return result;
}

export function getById(id) {
    return posts.find((post) => post.id === Number(id)) || null;
}

export function addPost(postData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const nextId = posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1;
            const newPost = {
                id: nextId,
                title: postData.title,
                content: postData.content,
                author: postData.author || "Anonymous",
                category: postData.category || "general"
            };

            posts = [...posts, newPost];
            resolve(newPost);
        }, 300);
    });
}