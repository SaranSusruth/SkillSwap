const router = require('./routes/users');
console.log('router paths', router.stack.map(layer => layer.route && layer.route.path));
console.log('handler types:',
  router.stack[0].route.stack[0].handle && typeof router.stack[0].route.stack[0].handle,
  router.stack[1].route.stack[0].handle && typeof router.stack[1].route.stack[0].handle,
  router.stack[2].route.stack[0].handle && typeof router.stack[2].route.stack[0].handle
);
