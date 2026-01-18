export default async function loadTemplate(url) {
    const template = document.createElement('template');
    const html = await fetch(url).then((response) => response.text());
    template.innerHTML = html;
    return template;
}