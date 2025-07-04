import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

function BlogForm({ onSave, editingBlog }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (editingBlog) {
      setTitle(editingBlog.title);
      setContent(editingBlog.content);
      setTags((editingBlog.tags || []).join(', '));
    } else {
      setTitle('');
      setContent('');
      setTags('');
    }
  }, [editingBlog]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const blog = {
      id: editingBlog?.id || uuidv4(),
      title,
      content,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: editingBlog?.createdAt || new Date().toISOString(),
    };
    onSave(blog);
    setTitle('');
    setContent('');
    setTags('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-2xl p-6 mb-10">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-700">{editingBlog ? 'Edit Blog' : 'Create Blog Post'}</h2>
      <input
        type="text"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:ring focus:ring-indigo-300"
        required
      />
      <textarea
        placeholder="Write your blog content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-32 px-4 py-2 border border-gray-300 rounded mb-4 focus:ring focus:ring-indigo-300"
        required
      ></textarea>
      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:ring focus:ring-indigo-300"
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 transition-colors"
      >
        {editingBlog ? 'Update Blog' : 'Publish Blog'}
      </button>
    </form>
  );
}

export default BlogForm;