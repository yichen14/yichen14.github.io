# Blog Posts

This folder contains all your blog posts. Every page shares one stylesheet,
`assets/zine.css` (the Minimal Zine Poster v0.1 design system), and one
behaviour script, `assets/zine.js`. Pages carry **no inline `<style>` block and
no per-page theme script** — don't add either, or the post will drift away from
the rest of the site.

## How to Add a New Blog Post

1. **Copy the template**: Make a copy of `template.html` and rename it (e.g., `my-new-post.html`)

2. **Edit the content**:
   - Update the `<title>` tag and the `<meta name="description">`
   - Update `.post-title`, `.post-meta` (date · read time) and `.post-tags`
   - Write your content in the `.post-content` section

3. **Add to blog.html**: Open `../blog.html` and add a new entry:
   ```html
   <article class="diary-item">
     <div class="diary-when">06 Nov<br />2023</div>
     <div>
       <h2 class="diary-title"><a href="posts/your-post.html">Your Post Title</a></h2>
       <p class="diary-excerpt">Brief summary of your post...</p>
       <div class="tags">
         <span class="tag">Tag1</span>
         <span class="tag">Tag2</span>
       </div>
     </div>
   </article>
   ```

4. **Update index.html** (optional): to feature the post on the homepage, add it
   to the `Writing` section:
   ```html
   <li>
     <span class="when">06 Nov 2023</span>
     <span class="what"><a href="posts/your-post.html">Your Post Title</a></span>
   </li>
   ```

   Keep the date in both listings identical to the post's own `.post-meta`
   dateline.

## Formatting Tips

- Use `<h2>` for main sections (each draws a hairline rule above it)
- Use `<h3>` for subsections
- Use `<p class="lead">` for an opening paragraph set slightly larger
- Use `<code>` for inline code, `<pre><code>` for blocks
- Use `<blockquote>` for quotes — rendered with a cobalt left rule
- Use `<div class="callout"><p>...</p></div>` for an aside
- Figures: `<div class="figure">...<div class="figcaption">Caption</div></div>`
- Images resize to fit the page width and are desaturated to match the paper
- Inline SVG diagrams can use `.dgm-box`, `.dgm-line`, `.dgm-area`, `.dgm-dot`,
  `.dgm-arrow`, `.dgm-grid`, `.dgm-axis`, plus text classes `.t`, `.t.muted`,
  `.t.accent`. Add `.accent` to any of them to draw it in cobalt.

## Design Constraints

The system deliberately allows **one** high-chroma colour: cobalt
(`--cobalt`). Use it for a single point of emphasis per screen, not for general
decoration. Everything else is paper, ink and gray. Avoid cards, drop shadows,
rounded corners and full-bleed imagery — they read as generic web UI and break
the printed-paper feel.

## Example Posts

Check out `template.html` for a complete example of blog post structure and formatting.
