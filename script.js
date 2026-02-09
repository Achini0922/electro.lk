// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.getElementById('nav-menu');
navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navMenu.classList.toggle('open');
});

// WhatsApp contact
(function(){
  const phone = '94771831215'; // without +
  const msg   = encodeURIComponent("Hi, I'm interested in your products at Electro.lk.");
  const waBtn = document.getElementById('wa-contact');
  if (waBtn){ waBtn.href = `https://wa.me/${phone}?text=${msg}`; }
})();

// Cart store
const cart = {
  items: [], // {sku, name, price, qty}
  add(p){ const i=this.items.find(x=>x.sku===p.sku); if(i){i.qty+=1;} else {this.items.push({...p,qty:1});} this.render(); },
  remove(sku){ this.items=this.items.filter(i=>i.sku!==sku); this.render(); },
  total(){ return this.items.reduce((s,i)=> s + (i.price * i.qty), 0); },
  render(){
    const wrap=document.getElementById('cart-items');
    const totalEl=document.getElementById('cart-total');
    wrap.innerHTML='';
    if(this.items.length===0){ wrap.innerHTML='<p class="small">Your cart is empty.</p>'; }
    else {
      this.items.forEach(i=>{
        const row=document.createElement('div');
        row.className='cart-item';
        row.innerHTML=`<div><div style="font-weight:600">${i.name}</div><div class="small">SKU: ${i.sku} · LKR ${i.price} x ${i.qty}</div></div><button class="btn btn-ghost" aria-label="Remove">Remove</button>`;
        row.querySelector('button').addEventListener('click', ()=>this.remove(i.sku));
        wrap.appendChild(row);
      });
    }
    totalEl.textContent = 'LKR ' + this.total().toLocaleString('en-LK');
  }
};

document.querySelectorAll('.add-to-cart').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    cart.add({ sku: btn.dataset.sku, name: btn.dataset.name, price: Number(btn.dataset.price) });
  });
});

// Checkout
document.getElementById('checkout-btn')?.addEventListener('click', ()=>{
  if(cart.items.length===0) return;
  const phone='94771831215';
  const lines=cart.items.map(i=>`• ${i.name} (SKU: ${i.sku}) x${i.qty} — LKR ${i.price*i.qty}`);
  const total=cart.total();
  const message=`Hello! I'd like to order:
${lines.join('
')}

Total: LKR ${total}

Name:
Address:`;
  const url=`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url,'_blank','noopener');
});

// Search + filters
const searchInput=document.getElementById('product-search');
const filterBtns=document.querySelectorAll('.filter');
function applyFilters(){
  const q=(searchInput.value||'').toLowerCase().trim();
  const active=document.querySelector('.filter.active')?.dataset.filter||'all';
  document.querySelectorAll('.product').forEach(card=>{
    const name=card.querySelector('h3').textContent.toLowerCase();
    const sku=card.querySelector('.sku').textContent.toLowerCase();
    const cat=card.dataset.category;
    const matchText=name.includes(q)||sku.includes(q);
    const matchCat=active==='all'||active===cat;
    card.style.display=(matchText&&matchCat)?'':'none';
  });
}
searchInput?.addEventListener('input', applyFilters);
filterBtns.forEach(b=> b.addEventListener('click', ()=>{ filterBtns.forEach(x=>x.classList.remove('active')); b.classList.add('active'); applyFilters(); }));
