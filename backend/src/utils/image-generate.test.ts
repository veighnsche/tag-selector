import { untangleDynamicTags } from './image-generate';

describe('untangleDynamicTags', () => {
  it('separates positive and negative dynamic tags correctly', () => {
    const inputs = {
      prompt: 'tag1, tag2, [[positive1!!negative1]], tag3, [[positive2!!negative2]], tag4',
      negative: 'negativeTag1, negativeTag2',
    };

    const result = untangleDynamicTags(inputs);

    expect(result).toEqual({
      prompt: 'tag1, tag2, positive1, tag3, positive2, tag4',
      negative: 'negative1, negative2, negativeTag1, negativeTag2',
    });
  });

  it('handles dynamic tags with no positive part', () => {
    const inputs = {
      prompt: 'tag1, tag2, [[positive1!!negative1]], tag3, [[positive2!!negative2]], [[!!negative3]]',
      negative: 'negativeTag1, negativeTag2',
    };

    const result = untangleDynamicTags(inputs);

    expect(result).toEqual({
      prompt: 'tag1, tag2, positive1, tag3, positive2',
      negative: 'negative1, negative2, negative3, negativeTag1, negativeTag2',
    });
  });

  it('does not introduce an extra comma when the last element in the prompt is a dynamic tag with no positive part', () => {
    const inputs = {
      prompt: 'tag1, tag2, [[positive1!!negative1]], tag3, [[positive2!!negative2]], [[!!negative3]], tag5',
      negative: 'negativeTag1, negativeTag2',
    };

    const result = untangleDynamicTags(inputs);

    expect(result).toEqual({
      prompt: 'tag1, tag2, positive1, tag3, positive2, tag5',
      negative: 'negative1, negative2, negative3, negativeTag1, negativeTag2',
    });
  });

  it('leaves prompts unchanged when there are no dynamic tags', () => {
    const inputs = {
      prompt: 'tag1, tag2, tag3, tag4, tag5',
      negative: 'negativeTag1, negativeTag2',
    };

    const result = untangleDynamicTags(inputs);

    expect(result).toEqual({
      prompt: 'tag1, tag2, tag3, tag4, tag5',
      negative: 'negativeTag1, negativeTag2',
    });
  });

  it('handles dynamic tags with commas in the positive part', () => {
    const inputs = {
      prompt: 'tag1, tag2, [[positive1, positive2!!negative1, negative2]], tag3',
      negative: 'negativeTag1, negativeTag2',
    };

    const result = untangleDynamicTags(inputs);

    expect(result).toEqual({
      prompt: 'tag1, tag2, positive1, positive2, tag3',
      negative: 'negative1, negative2, negativeTag1, negativeTag2',
    });
  });
});
