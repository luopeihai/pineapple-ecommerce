import Html from 'slate-html-serializer';
import React from 'react';

const BLOCK_TAGS = {
  p: 'paragraph',
  // blockquote: 'quote',
  h1: 'h1',
  h2: 'h1',
  h3: 'h1',
  hr: 'hr',
};
const MARK_TAGS = {
  b: 'bold',
  strong: 'bold',
  i: 'italic',
  em: 'italic',
  // s: 'strikethrough'
};

const RULES = [
  {
    deserialize(el, next) {
      const tagName = el.tagName.toLowerCase();
      if (tagName === 'img') {
        const src = el.getAttribute('src');
        return {
          object: 'block',
          type: 'image',
          isVoid: true,
          nodes: next(el.childNodes),
          data: {
            src,
          },
        };
      } else if (tagName === 'a') {
        return {
          object: 'inline',
          type: 'link',
          nodes: next(el.childNodes),
          data: {
            href: el.getAttribute('href'),
          },
        };
      } else if (tagName === 'game') {
        return {
          object: 'block',
          type: 'game',
          nodes: next(el.childNodes),
          isVoid: true,
          data: {
            objectId: el.getAttribute('objectId'),
            icon: el.getAttribute('icon'),
            name: el.getAttribute('name'),
            category: el.getAttribute('category'),
            rating: parseInt(el.getAttribute('rating')),
          },
        };
      } else if (BLOCK_TAGS[tagName]) {
        return {
          object: 'block',
          type: BLOCK_TAGS[tagName],
          nodes: next(el.childNodes),
        };
      } else if (MARK_TAGS[tagName]) {
        return {
          object: 'mark',
          type: MARK_TAGS[tagName],
          nodes: next(el.childNodes),
        };
      }
    },
    serialize(obj, children) {
      switch (obj.type) {
        case 'paragraph':
          return <p>{children}</p>;
        case 'hr':
          return <hr />;
        case 'h1':
          return <h1>{children}</h1>;
        case 'h2':
          return <h2>{children}</h2>;
        case 'h3':
          return <h3>{children}</h3>;
        case 'quote':
          return <blockquote>{children}</blockquote>;
        case 'bold':
          return <b>{children}</b>;
        case 'italic':
          return <i>{children}</i>;
        case 'strikethrough':
          return <s>{children}</s>;
        case 'image':
          const status = obj.data.get('status');
          const image = status ? <br /> : <img src={obj.data.get('src')} />;
          return image;
        case 'link':
          return (
            <a href={obj.data.get('href')} target="_blank">
              {children}
            </a>
          );
        case 'video':
          return (
            <video
              src={obj.data.get('src')}
              poster={obj.data.get('poster')}
              controls="true"
              playsinline="true"
              controlsList="nodownload"
            />
          );
      }
    },
  },
];

const parseHtml = (html) => {
  // img脱去a标签包裹
  //   const regx = /<a\b.*?>([\S\s]*?<img\b.*?>[\S\s]*?)<\/a>/g;
  //   html = html.replace(regx, '$1');
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  const { body } = parsed;
  return body;
};

const serializer = new Html({
  rules: RULES,
  defaultBlock: 'paragraph',
  parseHtml,
});

export default serializer;
