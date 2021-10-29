(this["webpackJsonppart2-notes-backend"]=this["webpackJsonppart2-notes-backend"]||[]).push([[0],{41:function(t,e,n){},42:function(t,e,n){"use strict";n.r(e);var c=n(16),r=n.n(c),o=n(7),a=n(3),i=n(2),u=n(0),s=function(t){var e=t.note,n=t.toggleImportance,c=e.important?"make not important":"make important";return Object(u.jsxs)("li",{className:"note",children:[e.content,Object(u.jsx)("button",{onClick:n,children:c})]})},j=function(t){var e=t.message;return Object(u.jsx)("p",{className:"error",children:e})},l=function(){return Object(u.jsxs)("div",{style:{color:"green",fontStyle:"italic",fontSize:16},children:[Object(u.jsx)("br",{}),Object(u.jsx)("em",{children:"Note app, Department of Computer Science, University of Helsinki 2021"})]})},b=n(4),d=n.n(b),f="/api/notes",p={getAll:function(){var t=d.a.get(f),e={id:1e3,content:"This note is not saved to server",date:"2019-05-30T17:30:31.098Z",important:!0};return t.then((function(t){return t.data.concat(e)}))},create:function(t){return d.a.post(f,t).then((function(t){return t.data}))},update:function(t,e){return d.a.put("".concat(f,"/").concat(t),e).then((function(t){return t.data}))}},m=function(){var t=Object(i.useState)([]),e=Object(a.a)(t,2),n=e[0],c=e[1],r=Object(i.useState)(""),b=Object(a.a)(r,2),d=b[0],f=b[1],m=Object(i.useState)(!1),O=Object(a.a)(m,2),h=O[0],v=O[1],x=Object(i.useState)("error display banner..."),g=Object(a.a)(x,2),S=g[0],k=g[1];Object(i.useEffect)((function(){p.getAll().then((function(t){c(t)}))}),[]);var y=h?n:n.filter((function(t){return t.important}));return Object(u.jsxs)("div",{children:[Object(u.jsx)("h1",{children:"Notes"}),Object(u.jsx)(j,{message:S}),Object(u.jsx)("div",{children:Object(u.jsxs)("button",{onClick:function(){return v(!h)},children:["show ",h?"important":"all"]})}),Object(u.jsx)("ul",{children:y.map((function(t){return Object(u.jsx)(s,{note:t,toggleImportance:function(){return function(t){var e=n.find((function(e){return e.id===t})),r=Object(o.a)(Object(o.a)({},e),{},{important:!e.important});p.update(t,r).then((function(e){c(n.map((function(n){return n.id!==t?n:e})))})).catch((function(r){k("Note '".concat(e.content,"' was already removed from server")),setTimeout((function(){k(null)}),5e3),c(n.filter((function(e){return e.id!==t})))}))}(t.id)}},t.id)}))}),Object(u.jsxs)("form",{onSubmit:function(t){t.preventDefault();var e={content:d,date:(new Date).toISOString(),important:Math.random()>.5,id:n.length+1};p.create(e).then((function(t){c(n.concat(t)),f("")}))},children:[Object(u.jsx)("input",{value:d,onChange:function(t){f(t.target.value)}}),Object(u.jsx)("button",{type:"submit",children:"save"})]}),Object(u.jsx)(l,{})]})};n(41);r.a.render(Object(u.jsx)(m,{}),document.getElementById("root"))}},[[42,1,2]]]);
//# sourceMappingURL=main.6b60e762.chunk.js.map