import {getRequest} from './api'
export const initMenu = (router, store)=> {
  //如果长度大于0，说明已经有菜单数据了，则直接返回，该方法执行结束
  if (store.state.routes.length > 0) {
    return;
  }
  getRequest("/config/menus").then(resp=> {
    if (resp && resp.status == 200) {
      //格式化菜单数据，主要是格式化component
      var fmtRoutes = formatRoutes(resp.data);
      //将格式化后的菜单添加到路由中
      router.addRoutes(fmtRoutes);
      //调用store中的initMenu方法，只需要传第二个参数。第一个参数默认是state。
      store.commit('initMenu', fmtRoutes);
    }
  })
}
export const formatRoutes = (routes)=> {
  let fmRoutes = [];
  //router是routes中的每一个元素
  routes.forEach(router=> {
    //相当于path=router.path,component=router.component
    let {
      path,
      component,
      name,
      meta,
      iconCls,
      children
    } = router;
    if (children && children instanceof Array) {
      children = formatRoutes(children);
    }
    //定义一个对象
    let fmRouter = {
      path: path,
      //初始化组件
      component(resolve){
        if (component.startsWith("Home")) {
          require(['../components/' + component + '.vue'], resolve)
        } else if (component.startsWith("Emp")) {
          require(['../components/emp/' + component + '.vue'], resolve)
        } else if (component.startsWith("Per")) {
          require(['../components/personnel/' + component + '.vue'], resolve)
        } else if (component.startsWith("Sal")) {
          require(['../components/salary/' + component + '.vue'], resolve)
        } else if (component.startsWith("Sta")) {
          require(['../components/statistics/' + component + '.vue'], resolve)
        } else if (component.startsWith("Sys")) {
          require(['../components/system/' + component + '.vue'], resolve)
        }
      },
      name: name,
      iconCls: iconCls,
      meta:meta,
      children: children
    };
    //放入数组中
    fmRoutes.push(fmRouter);
  })
  return fmRoutes;
}
