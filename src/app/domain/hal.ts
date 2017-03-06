export class Hal {
  public _embedded:any = {};
  public _links:any = {};

  constructor(obj:any) {
    if (obj._embedded) {
      this._embedded = obj._embedded;
    }
    this._links = obj._links;
  }

  getLink(name:string = "self") {
    if (this._links) {
      if (this._links[name]) {
        return this._links[name];
      }
    }
    return null;
  }

  getLinkHref(name:string = "self", removeParams:boolean = false) {
    var link = this.getLink(name);
    if (link) {
      if (link.href) {
        if (removeParams) {
          let href = link.href;
          href = href.split("{")[0];
          return href;
        }
        return link.href;
      }
    }
    return null;
  }

  setLinkHref(name:string, href:string) {
    if (!name || !href) {
      return;
    }
    if (!this._links) {
      this._links = {};
    }
    this._links[name] = {href:href};
  }

  getEmbedded(name:string) {
    if (!name) {
      return null;
    }
    if (this._embedded) {
      if (this._embedded[name]) {
        return this._embedded[name];
      }
    }
    return null;
  }
}
