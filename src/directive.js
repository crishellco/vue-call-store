function shouldShow(context, arg, value) {
  switch (arg) {
    case 'pending':
      return context.$callIsPending(value);
    case 'done':
      return context.$callIsDone(value);
    case 'failed':
      return context.$callHasFailed(value);
  }
}

const directive = (el, { arg, value }, vnode) => {
  const { context } = vnode;

  if (!shouldShow(context, arg, value)) {
    const comment = document.createComment(' ');
    vnode.elm = comment;
    vnode.text = ' ';
    vnode.isComment = true;
    vnode.context = undefined;
    vnode.tag = undefined;
    vnode.data.directives = undefined;

    // istanbul ignore next
    if (vnode.componentInstance) {
      vnode.componentInstance.$el = comment;
    }
  } else {
    vnode.key++;
  }
};

export default directive;
