#!/usr/bin/env python3
"""Generate app icons for Hoje na Palavra PWA"""
import os
import math
import struct
import zlib

def create_png(width, height, pixels):
    """Create PNG bytes from pixel data (RGBA)"""
    def chunk(name, data):
        c = name + data
        crc = zlib.crc32(c) & 0xffffffff
        return struct.pack('>I', len(data)) + c + struct.pack('>I', crc)
    
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    
    raw = b''
    for y in range(height):
        raw += b'\x00'
        for x in range(width):
            p = pixels[y * width + x]
            raw += bytes([p[0], p[1], p[2]])
    
    compressed = zlib.compress(raw, 9)
    
    png = b'\x89PNG\r\n\x1a\n'
    png += chunk(b'IHDR', ihdr)
    png += chunk(b'IDAT', compressed)
    png += chunk(b'IEND', b'')
    return png

def draw_icon(size):
    """Draw the Hoje na Palavra icon"""
    pixels = []
    cx, cy = size / 2, size / 2
    r = size / 2
    
    for y in range(size):
        for x in range(size):
            # Distance from center
            dx, dy = x - cx, y - cy
            dist = math.sqrt(dx*dx + dy*dy)
            
            # Background - golden gradient
            t = (y / size)
            r1, g1, b1 = 184, 134, 11   # dark gold
            r2, g2, b2 = 232, 180, 32   # light gold
            
            bg_r = int(r1 + (r2 - r1) * t)
            bg_g = int(g1 + (g2 - g1) * t)
            bg_b = int(b1 + (b2 - b1) * t)
            
            # Rounded corners
            corner_r = size * 0.22
            in_bounds = True
            for (cx2, cy2) in [(corner_r, corner_r), (size-corner_r, corner_r),
                                (corner_r, size-corner_r), (size-corner_r, size-corner_r)]:
                if x < corner_r and y < corner_r:
                    if math.sqrt((x-corner_r)**2 + (y-corner_r)**2) > corner_r:
                        in_bounds = False; break
                elif x > size-corner_r and y < corner_r:
                    if math.sqrt((x-(size-corner_r))**2 + (y-corner_r)**2) > corner_r:
                        in_bounds = False; break
                elif x < corner_r and y > size-corner_r:
                    if math.sqrt((x-corner_r)**2 + (y-(size-corner_r))**2) > corner_r:
                        in_bounds = False; break
                elif x > size-corner_r and y > size-corner_r:
                    if math.sqrt((x-(size-corner_r))**2 + (y-(size-corner_r))**2) > corner_r:
                        in_bounds = False; break
                break
            
            if not in_bounds:
                pixels.append((255, 255, 255))
                continue
            
            # Draw star symbol (✦) in center
            star_size = size * 0.35
            
            def in_star(px, py, sz):
                """Simple 4-pointed star"""
                dx2, dy2 = px - cx, py - cy
                r = math.sqrt(dx2*dx2 + dy2*dy2)
                if r > sz: return False
                angle = math.atan2(dy2, dx2)
                # 4-pointed star
                for a in [0, math.pi/2, math.pi, 3*math.pi/2]:
                    da = min(abs(angle - a), 2*math.pi - abs(angle - a))
                    arm_r = sz * (0.25 + 0.75 * (1 - da / (math.pi/4))) if da < math.pi/4 else sz * 0.25
                    if r < arm_r * 1.0:
                        return True
                return False
            
            if in_star(x, y, star_size):
                # White star
                alpha = 1.0
                px_r = int(255 * alpha + bg_r * (1 - alpha))
                px_g = int(255 * alpha + bg_g * (1 - alpha))
                px_b = int(255 * alpha + bg_b * (1 - alpha))
                pixels.append((px_r, px_g, px_b))
            else:
                pixels.append((bg_r, bg_g, bg_b))
    
    return create_png(size, size, pixels)

sizes = [72, 96, 128, 144, 152, 192, 384, 512]
icons_dir = os.path.join(os.path.dirname(__file__), 'icons')
os.makedirs(icons_dir, exist_ok=True)

for s in sizes:
    png_data = draw_icon(s)
    path = os.path.join(icons_dir, f'icon-{s}.png')
    with open(path, 'wb') as f:
        f.write(png_data)
    print(f'Created {path} ({len(png_data)} bytes)')

print('All icons generated!')
