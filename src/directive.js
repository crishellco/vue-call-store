function shouldShow(context, arg, value) {
  switch (arg) {
    case 'pending':
      return context.$requestIsPending(value);
    case 'done':
      return context.$requestIsDone(value);
    case 'failed':
      return context.$requestHasFailed(value);
  }
}

const directive = (el, { arg, value }, vnode) => {
  const { context } = vnode;

  if (!shouldShow(context, arg, value)) {
    const comment = document.createComment(' ');
    Object.defineProperty(comment, 'setAttribute', {
      value: () => undefined
    });
    vnode.elm = comment;
    vnode.text = ' ';
    vnode.isComment = true;
    vnode.context = undefined;
    vnode.tag = undefined;
    vnode.data.directives = undefined;

    if (vnode.componentInstance) {
      vnode.componentInstance.$el = comment;
    }
  } else {
    vnode.key++;
  }
};

export default directive;
