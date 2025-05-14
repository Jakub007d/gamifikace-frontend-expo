import { Converter } from 'typedoc';

/**
 * Plugin, ktorý umožní kategorizovať @screen komponenty pod "Obrazovky".
 */
export function load(app) {
  app.converter.on(Converter.EVENT_CREATE_DECLARATION, (context, reflection) => {
    const comment = reflection.comment;

    if (!comment || !comment.blockTags) return;

    const hasScreenTag = comment.blockTags.some(tag => tag.tag === "@screen");

    if (hasScreenTag) {
      comment.blockTags.push({
        tag: '@category',
        content: [{ kind: 'text', text: 'Obrazovky' }]
      });
      comment.blockTags = comment.blockTags.filter(tag => tag.tag !== "@screen");
    }
  });
}
