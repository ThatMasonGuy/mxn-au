import{B as d,$ as p,u as a,o as u,c,a0 as m,R as f,b,p as g,q as _,l as x,s as y}from"./@vue-CaXq9D3o.js";import{u as V}from"./@vueuse-CiJxbGvj.js";import{c as n}from"./index-BVf6JYJ_.js";import{k as q}from"./radix-vue-CoAoGb9k.js";const S={__name:"Input",props:{defaultValue:{type:[String,Number],required:!1},modelValue:{type:[String,Number],required:!1},class:{type:null,required:!1}},emits:["update:modelValue"],setup(t,{emit:l}){const s=t,e=V(s,"modelValue",l,{passive:!0,defaultValue:s.defaultValue});return(v,o)=>d((u(),c("input",{"onUpdate:modelValue":o[0]||(o[0]=i=>m(e)?e.value=i:null),class:f(a(n)("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",s.class))},null,2)),[[p,a(e)]])}},C={__name:"Label",props:{for:{type:String,required:!1},asChild:{type:Boolean,required:!1},as:{type:null,required:!1},class:{type:null,required:!1}},setup(t){const l=t,s=b(()=>{const{class:r,...e}=l;return e});return(r,e)=>(u(),g(a(q),y(s.value,{class:a(n)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",l.class)}),{default:_(()=>[x(r.$slots,"default")]),_:3},16,["class"]))}};export{C as _,S as a};
