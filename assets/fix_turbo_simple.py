import re

with open('lumelle-bundle.js', 'r') as f:
    content = f.read()

# Find the turbo:load handler
idx = content.find('document.addEventListener("turbo:load"')
if idx != -1:
    end_idx = content.find('});', idx)
    if end_idx != -1:
        end_idx += 3
        old = content[idx:end_idx]
        print(f"Found handler: {old}")
        
        # New handler that forces page reload for product navigation
        # This is the simplest and most reliable approach
        new_handler = '''document.addEventListener("turbo:load",()=>{const e=window.location.pathname.match(/\\/products\\/([^\\/]+)/),t=e?e[1]:null;if(t){const e=window.$;if(e&&e.pdp&&e.pdp[t]){console.log("Product nav detected:",t);window.location.reload()}}});'''
        
        content = content[:idx] + new_handler + content[end_idx:]
        print("Replaced with simple reload handler")

with open('lumelle-bundle.js', 'w') as f:
    f.write(content)

print("Done!")
