import { KnowledgeChestPage } from './app.po';

describe('knowledge-chest App', function() {
  let page: KnowledgeChestPage;

  beforeEach(() => {
    page = new KnowledgeChestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
