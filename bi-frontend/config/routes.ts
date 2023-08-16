export default [
  { path: '/user', layout: false, routes: [
    { path: '/user/login', component: './User/Login' },
    { path: '/user/register', component: './User/Register' },
    ] },
    { path: '/', redirect: '/add_chart' },
    { name: 'add chart', path: '/add_chart', icon: 'barChart', component: './AddChart' },
    { name: 'add chart async', path: '/add_chart_async', icon: 'barChart', component: './AddChartAsync' },
    { name: 'my charts', path: '/my_chart', icon: 'pieChart', component: './MyChart' },
  { path: '/welcome', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', component: './Admin' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
