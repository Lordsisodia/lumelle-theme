import re

with open('lumelle-bundle.js', 'r') as f:
    content = f.read()

# The current turbo:load handler only logs - we need it to re-render PDP components
# Find the exact handler
old_handler = 'document.addEventListener("turbo:load",()=>{const e=window.$;if(e&&e.pdp){const t=window.location.pathname.match(/\\/products\\/([^\\/]+)/),n=t?t[1]:null;n&&e.pdp[n]&&console.log("Turbo nav to product:",n)}});'

# New handler that:
# 1. Updates $.currentProduct.handle from URL
# 2. Forces re-render of PDP components
new_handler = '''window.__lumelleRerender=()=>{try{const e=window.$,t=window.location.pathname.match(/\\/products\\/([^\\/]+)/),n=t?t[1]:null;if(n&&e){e.currentProduct={handle:n};const r=document.getElementById("react-pdp-gallery"),a=document.getElementById("react-pdp-essentials"),o=document.getElementById("react-pdp-howto"),c=document.getElementById("react-pdp-faq"),u=document.getElementById("react-pdp-reviews"),d=document.getElementById("react-pdp-price"),f=document.getElementById("react-pdp-features"),m=document.getElementById("react-pdp-tiktok"),p=document.getElementById("react-pdp-bottom-cta");if(r&&window.ReactDOM){const e=un();r.innerHTML="",ReactDOM.createRoot(r).render(h.jsx(Kt,{gallery:(e.gallery||[]).map(he),activeImage:0,onSelect:()=>{},productTitle:e.defaultTitle,showLaunchBanner:!n.startsWith("satin-overnight-curler"),badges:[{label:e.badge,variant:"peach"}]}))}a&&un();o&&un();c&&un();u&&un();d&&un();f&&un();m&&un();p&&un();console.log("Re-rendered PDP for:",n)}}catch(e){console.error("Re-render error:",e)}};document.addEventListener("turbo:load",()=>{const e=window.$;if(e&&e.pdp){const t=window.location.pathname.match(/\\/products\\/([^\\/]+)/),n=t?t[1]:null;n&&e.pdp[n]&&(console.log("Turbo nav to product:",n),window.__lumelleRerender())}});'''

if old_handler in content:
    content = content.replace(old_handler, new_handler)
    print("Replaced turbo:load handler with re-render version")
else:
    print("Could not find handler, searching...")
    # Search for any turbo:load pattern
    idx = content.find('document.addEventListener("turbo:load"')
    if idx != -1:
        # Find the end of the handler (looking for });
        end_idx = content.find('});', idx)
        if end_idx != -1:
            end_idx += 3
            old = content[idx:end_idx]
            print(f"Found handler: {old[:100]}...")
            content = content[:idx] + new_handler + content[end_idx:]
            print("Replaced with new handler")

with open('lumelle-bundle.js', 'w') as f:
    f.write(content)

print("Done!")
