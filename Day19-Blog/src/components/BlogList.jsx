import BlogCard from './BlogCard';

function BlogList({ blogs, onEdit, onDelete }) {
  if (blogs.length === 0)
    return <p className="text-center text-gray-500">No blog posts yet.</p>;

  return (
    <div className="grid gap-6">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default BlogList;