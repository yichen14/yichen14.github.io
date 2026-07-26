# Blog Posts

This folder contains all your blog posts. Every page shares one stylesheet,
`assets/zine.css` (the Minimal Zine Poster v0.1 design system), and one
behaviour script, `assets/zine.js`. Pages carry **no inline `<style>` block and
no per-page theme script** — don't add either, or the post will drift away from
the rest of the site.

## Two Categories

| | `Technical` / 技术 | `Personal` / 随笔 |
|---|---|---|
| `.post-kind` label | `技术` / `Technical` | `随笔` / `Personal` |
| Section in `blog.html` | `#technical` | `#personal` |
| Citation block | **yes** | **no** |

Every post carries a `.post-kind` label above its title. Technical posts end
with a `.citation` block (APA + BibTeX with copy buttons); personal notes
deliberately omit it — they aren't meant to be cited.

## Bilingual Copy

Every post exists in Chinese and English. Pair the two with `data-i18n`:

```html
<p>
  <span data-i18n="zh" lang="zh-Hans">中文段落。</span>
  <span data-i18n="en" lang="en">English paragraph.</span>
</p>
```

The stylesheet hides whichever language is inactive, so **both must always be
present in equal numbers** — an unpaired block will vanish in one language.
For long articles it is easier to wrap the whole body twice (see
`fall-2023.html`); for dense ones, pair inline (see `thoughts-on-agents.html`).
SVG diagram labels pair the same way, by wrapping `<text>` in
`<g data-i18n="zh">` / `<g data-i18n="en">`.

Reader language is chosen by: stored preference → browser language → English.
Without JavaScript the Chinese original shows.

## How to Add a New Blog Post

1. **Copy the template**: Make a copy of `template.html` and rename it (e.g., `my-new-post.html`)

2. **Edit the content**:
   - Update the `<title>` tag and the `<meta name="description">`
   - Update `.post-title`, `.post-meta` (date · read time) and `.post-tags`
   - Write your content in the `.post-content` section

3. **Add to blog.html**: Open `../blog.html` and add the entry to the
   `#technical` or `#personal` section, matching the post's `.post-kind`:
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
