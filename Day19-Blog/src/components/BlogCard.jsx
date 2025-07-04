function BlogCard({ blog, onEdit, onDelete }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow">
      <h3 className="text-2xl font-bold text-indigo-800 mb-2">{blog.title}</h3>
      <p className="text-gray-700 whitespace-pre-wrap mb-3">{blog.content}</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {blog.tags && blog.tags.map((tag) => (
          <span
            key={tag}
            className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs"
          >
            #{tag}
          </span>
        ))}
      </div>
      <p className="text-sm text-gray-500 mb-3">Created: {new Date(blog.createdAt).toLocaleString()}</p>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(blog)}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(blog.id)}
          className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default BlogCard;
