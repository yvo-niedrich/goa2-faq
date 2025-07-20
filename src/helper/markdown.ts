import { marked } from 'marked';

document.addEventListener('click', (e: any) => {
    if (e.target.closest('.faq-overlay')) {
        return;
    }

    const el = e.target.closest('.inline-icon-wrapper');
    document.querySelectorAll('.inline-icon-wrapper.show-preview').forEach((e) => {
        if (e !== el) {
            e.classList.remove('show-preview');
        }
    });
});

function shouldPreview(href: string): boolean {
    if (!href) return false;
    return (
        href.includes('token') ||
        href.includes('rune') ||
        href.includes('counter') ||
        href.includes('marker') ||
        href.includes('tiebreaker')
    );
}

const renderer = new marked.Renderer();
renderer.image = ({ href, title, text }) => {
    const titleAttr = title ? ` title="${title}"` : '';

    return shouldPreview(href)
        ? `<span
            class="inline-icon-wrapper"
            tabindex="0"
            role="button"
            style="--icon-url: url('${href}')"
            onclick="event.stopPropagation(); this.classList.toggle('show-preview')">
            <img src="${href}" alt="${text}" class="inline-icon"${titleAttr} />
        </span>`
        : `<img src="${href}" alt="${text}"${titleAttr} />`;
};

marked.setOptions({ renderer });

export const markdown = marked;
