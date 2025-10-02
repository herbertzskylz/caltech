// Mobile Navbar Toggle
const navToggle = document.getElementById("nav-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const closeMenu = document.getElementById("close-menu");

if(navToggle && mobileMenu){
  navToggle.addEventListener("click", () => mobileMenu.style.left = "0");
}

if(closeMenu && mobileMenu){
  closeMenu.addEventListener("click", () => mobileMenu.style.left = "-100%");
}

// Load Blog Posts
async function loadBlogPosts(){
  const container = document.getElementById("blog-posts");
  if(!container) return;

  try{
    const res = await fetch("http://localhost:5000/api/posts");
    const posts = await res.json();
    container.innerHTML = posts.map(p => `
      <article class="blog-card">
        <img src="${p.ImageUrl || 'images/default-blog.jpg'}" alt="${p.Title}">
        <h3>${p.Title}</h3>
        <p>${p.Summary || (p.Content ? p.Content.substring(0,150)+'...' : '')}</p>
        <small>By ${p.Author || 'Admin'} | ${new Date(p.DateCreated).toLocaleDateString()}</small>
      </article>
    `).join("");
  } catch(err){
    console.error(err);
    container.innerHTML = "<p>⚠️ Failed to load blog posts.</p>";
  }
}

// Load Testimonials
async function loadTestimonials(){
  const container = document.getElementById("testimonials-container");
  if(!container) return;

  try{
    const res = await fetch("http://localhost:5000/api/testimonials");
    const testimonials = await res.json();
    container.innerHTML = testimonials.map(t => `
      <div class="testimonial-card">
        <p>"${t.Feedback}"</p>
        <h4>- ${t.ClientName}</h4>
        <span>⭐ ${t.Rating}/5</span>
      </div>
    `).join("");
  } catch(err){
    console.error(err);
    container.innerHTML = "<p>⚠️ Failed to load testimonials.</p>";
  }
}

// Contact Form Submission
async function submitContactForm(e){
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector("#contact-name").value;
  const email = form.querySelector("#contact-email").value;
  const subject = form.querySelector("#contact-subject").value;
  const message = form.querySelector("#contact-message").value;

  try{
    const res = await fetch("http://localhost:5000/api/contact", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({name,email,subject,message})
    });
    const data = await res.json();
    if(data.success){
      alert("✅ Message sent!");
      form.reset();
    } else {
      alert("⚠️ Failed to send message.");
    }
  } catch(err){
    console.error(err);
    alert("⚠️ Error sending message.");
  }
}

// Initialize on DOM load
window.addEventListener("DOMContentLoaded", ()=>{
  loadBlogPosts();
  loadTestimonials();
  const form = document.getElementById("contact-form");
  if(form) form.addEventListener("submit", submitContactForm);
});
