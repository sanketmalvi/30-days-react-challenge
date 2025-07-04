import { useState, useEffect } from 'react';
import BlogForm from './components/BlogForm';
import BlogList from './components/BlogList';
import { getBlogsFromStorage, saveBlogsToStorage } from './utils/storage';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  useEffect(() => {
    const storedBlogs = getBlogsFromStorage();
    setBlogs(storedBlogs);
  }, []);

  const handleSave = (blog) => {
    let updatedBlogs;
    if (editingBlog) {
      updatedBlogs = blogs.map((b) => (b.id === blog.id ? blog : b));
    } else {
      updatedBlogs = [blog, ...blogs];
    }
    setBlogs(updatedBlogs);
    saveBlogsToStorage(updatedBlogs);
    setEditingBlog(null);
  };

  const handleEdit = (blog) => setEditingBlog(blog);

  const handleDelete = (id) => {
    const updatedBlogs = blogs.filter((b) => b.id !== id);
    setBlogs(updatedBlogs);
    saveBlogsToStorage(updatedBlogs);
  };

  const uniqueTags = ['All', ...new Set(blogs.flatMap(blog => blog.tags || []))];

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          blog.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'All' || (blog.tags && blog.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0c3fc] via-[#8ec5fc] to-[#f9f9f9] p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6 tracking-tight">✨ Blog</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-2/3 px-4 py-2 rounded-lg border border-gray-300 shadow-md"
          />

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 rounded-lg border border-gray-300 shadow-md"
          >
            {uniqueTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        <BlogForm onSave={handleSave} editingBlog={editingBlog} />
        <BlogList blogs={filteredBlogs} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
}

export default App;