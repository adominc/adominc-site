"""Offline checks for the hand-written site; Python standard library only."""

from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
PRODUCTS = [
    ("The ConvexValue Terminal", "https://convexvalue.com",
     "Web-based options analytics for exploring market activity, positioning, and volatility."),
    ("cvforge", "https://cvforge.convexvalue.com",
     "A desktop workspace for options analytics, with customizable tools and visualizations."),
    ("OptionsData.ai", "https://optionsdata.ai",
     "We’re building a US options data API and MCP server for AI assistants and the software you build with them."),
]


class Element:
    def __init__(self, tag, attrs=()):
        self.tag = tag
        self.attrs = dict(attrs)
        self.children = []

    def find(self, tag):
        return [child for child in self.walk() if child.tag == tag]

    def walk(self):
        yield self
        for child in self.children:
            if isinstance(child, Element):
                yield from child.walk()

    def text(self):
        return " ".join("".join(
            child.text() if isinstance(child, Element) else child
            for child in self.children
        ).split())


class Page(HTMLParser):
    VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input",
            "link", "meta", "param", "source", "track", "wbr"}

    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.root = Element("document")
        self.stack = [self.root]
        self.feed(path.read_text())
        self.close()
        assert len(self.stack) == 1, f"Unclosed HTML in {path}"
        ids = [e.attrs["id"] for e in self.root.walk() if "id" in e.attrs]
        assert len(ids) == len(set(ids)), f"Duplicate IDs in {path}"
        self.ids = set(ids)

    def handle_starttag(self, tag, attrs):
        element = Element(tag, attrs)
        self.stack[-1].children.append(element)
        if tag not in self.VOID:
            self.stack.append(element)

    def handle_endtag(self, tag):
        assert self.stack[-1].tag == tag, f"Mismatched closing tag: {tag}"
        self.stack.pop()

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def check():
    pages = {path: Page(path) for path in ROOT.rglob("*.html")}
    for path, page in pages.items():
        assert len(page.root.find("h1")) == 1, f"Expected one h1: {path}"
        assert page.root.find("html")[0].attrs.get("lang") == "en"
        for element in page.root.walk():
            for attr in ("href", "src"):
                if attr not in element.attrs:
                    continue
                value = element.attrs[attr]
                assert value and not any(c.isspace() for c in value), value
                url = urlsplit(value)
                if url.scheme or url.netloc:
                    assert url.scheme in {"https", "mailto", "tel"}, value
                    continue
                target = ((ROOT / unquote(url.path).lstrip("/"))
                          if url.path.startswith("/")
                          else path.parent / unquote(url.path)) if url.path else path
                if target.is_dir():
                    target /= "index.html"
                assert target.is_file(), f"Missing local target: {path}: {value}"
                if url.fragment:
                    assert target in pages and unquote(url.fragment) in pages[target].ids, value
                if element.tag == "a":
                    assert element.text() or element.attrs.get("aria-label"), "Unnamed link"

    home = pages[ROOT / "index.html"].root
    main = home.find("main")[0]
    sections = main.find("section")
    assert "hero" in sections[0].attrs.get("class", "").split()
    products = sections[1]
    assert products.attrs.get("aria-labelledby") == "products-title"
    assert products.find("h2")[0].text() == "Our products"
    assert products.find("h2")[0].attrs.get("id") == "products-title"
    items = products.find("li")
    assert len(items) == len(PRODUCTS), "Expected exactly three products"
    for item, (name, url, copy) in zip(items, PRODUCTS):
        link, = item.find("a")
        assert link.text() == name and link.attrs.get("href") == url, name
        assert item.find("h3")[0].text() == name, name
        assert item.find("p")[0].text() == copy, f"Unapproved product copy: {name}"
    contact = pages[ROOT / "contact/index.html"].root
    assert contact.find("h1")[0].text() == "Contact us"
    contact_links = {a.attrs.get("href") for a in contact.find("a")}
    assert {"mailto:hello@adominc.com", "tel:+16468752117"} <= contact_links

    css = ROOT / "css/style.css"
    for value in re.findall(r"url\(['\"]?([^)'\"]+)", css.read_text()):
        assert (ROOT / value.lstrip("/")).is_file(), f"Missing CSS asset: {value}"
    print("PASS: HTML structure, local links/assets/fragments, approved products, contact details")


if __name__ == "__main__":
    check()
