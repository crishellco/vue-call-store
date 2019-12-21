const directiveFactory = () => {
  const hook = (el, { arg, value }, { context }) => {
    let show = false;

    switch (arg) {
      case 'pending':
        show = context.$requestIsPending(value);
        break;
      case 'done':
        show = context.$requestIsDone(value);
        break;
      case 'failed':
        show = context.$requestHasFailed(value);
        break;
    }

    if (show) {
      el.style.visibility = 'inherit';
    } else {
      el.style.visibility = 'hidden';
    }
  };

  return {
    inserted: hook,
    update: hook
  };
};

export default directiveFactory;
