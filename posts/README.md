# Blog Posts

This folder contains all your blog posts.

## How to Add a New Blog Post

1. **Copy the template**: Make a copy of `template.html` and rename it (e.g., `my-new-post.html`)

2. **Edit the content**:
   - Update the `<title>` tag
   - Update the post title, date, and tags
   - Write your content in the `.post-content` section
   - You can use HTML for formatting

3. **Add to blog.html**: Open `../blog.html` and add a new entry:
   ```html
   <div class="blog-item">
     <div class="blog-date">Month Day, Year</div>
     <div class="blog-title">
       <a href="posts/your-post.html">Your Post Title</a>
     </div>
     <div class="blog-excerpt">
       Brief summary of your post...
     </div>
     <div class="blog-tags">
       <span class="blog-tag">Tag1</span>
       <span class="blog-tag">Tag2</span>
     </div>
   </div>
   ```

4. **Update index.html** (optional): If you want to feature this post on the homepage, add it to the "Recent Blog Posts" section.

## Formatting Tips

- Use `<h2>` for main sections
- Use `<h3>` for subsections
- Use `<code>` for inline code
- Use `<blockquote>` for quotes
- Images will automatically resize to fit the page width

## Example Posts

Check out `template.html` for a complete example of blog post structure and formatting.

