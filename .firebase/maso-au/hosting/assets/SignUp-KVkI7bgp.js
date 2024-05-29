import{r as d,m as V,W as g,c as w,a as t,y as o,q as l,a1 as y,U as r,a2 as b,o as N,Y as x,Z as I}from"./@vue-CaXq9D3o.js";import{_ as U,a as S}from"./index-BVf6JYJ_.js";import{a as B,_ as k}from"./Label-D6L-l8an.js";import{b as P,a as q}from"./auth-CfT-rhLO.js";import{F as f}from"./vue-sonner-CeT9C6zK.js";import"./radix-vue-CoAoGb9k.js";import"./class-variance-authority-Bb4qSo10.js";import"./clsx-B-dksMZM.js";import"./tailwind-merge-3VKOpVsw.js";import"./vue-router-Byh-rWNN.js";import"./@heroicons-M9HGTofz.js";import"./@firebase-BQ9lEHMd.js";import"./idb-BXWtuYvb.js";import"./tslib-BGVaTf34.js";import"./firebase-ZE1290EP.js";import"./@vueuse-CiJxbGvj.js";const C={components:{Button:S,Input:B,Label:k},setup(){const c=d("https://source.unsplash.com/random/3"),a=d("https://source.unsplash.com/random/4"),_=d(""),e=d(""),h=d(""),v=d(""),u=d(""),p=d(""),n=d(""),i=d(""),s=()=>{a.value=`https://source.unsplash.com/random/${Date.now()}`;const m=c.value;c.value=a.value,a.value=m};return V(()=>{setInterval(s,8e3)}),{currentImage:c,nextImage:a,firstName:_,lastName:e,userName:h,email:v,phoneNumber:u,dateOfBirth:p,password:n,confirmPassword:i,handleSignUp:async()=>{try{console.log("Initiating user sign up"),await P(_.value,e.value,h.value,v.value,u.value,p.value,n.value,i.value),console.log("Sign up successful"),f.success("Sign up successful!")}catch(m){console.error("Error during sign up:",m),f.error(m.message)}},handleGoogleSignUp:async()=>{try{console.log("Initiating Google sign up"),await q(),console.log("Google sign up successful"),f.success("Sign up successful!")}catch(m){console.error("Error during Google sign up:",m),f.error(m.message)}}}}},G=c=>(x("data-v-c5a4ec6b"),c=c(),I(),c),E={class:"w-full lg:grid lg:min-h-screen lg:grid-cols-2 h-screen"},L={class:"flex items-center justify-center py-12 px-4 mx-auto"},O={class:"mx-auto grid w-[350px] gap-6"},j=G(()=>t("div",{class:"grid gap-2 text-center"},[t("h1",{class:"text-3xl font-bold mb-6"},"Sign up"),t("p",{class:"text-balance text-muted-foreground"}," Enter your details below to create your account ")],-1)),A={class:"grid gap-4"},D={class:"grid gap-2"},F={class:"grid grid-cols-2 gap-4"},M={class:"grid gap-2"},z={class:"grid gap-2"},T={class:"grid gap-2"},W={class:"grid gap-2"},H={class:"grid gap-2"},J={class:"grid grid-cols-2 gap-4"},R={class:"grid gap-2"},Y={class:"flex items-center"},Z={class:"grid gap-2"},K={class:"flex items-center"},Q={class:"mt-4 text-center text-sm"},X={class:"bg-gray-500 lg:block relative overflow-hidden"},$=["src"],ee=["src"];function oe(c,a,_,e,h,v){const u=g("Button"),p=g("router-link"),n=g("Label"),i=g("Input");return N(),w("div",E,[t("div",L,[t("div",O,[o(p,{to:"/"},{default:l(()=>[o(u,{href:"/",class:"absolute top-2 left-2 z-20"},{default:l(()=>[r("Return Home")]),_:1})]),_:1}),o(p,{to:"/"},{default:l(()=>[o(u,{href:"/",class:"absolute top-2 right-2 z-20"},{default:l(()=>[r("Dark Mode")]),_:1})]),_:1}),j,t("form",A,[t("div",D,[o(n,{for:"userName"},{default:l(()=>[r("Username")]),_:1}),o(i,{id:"userName",type:"text",autocomplete:"username",placeholder:"AwesomeUser24",required:"",modelValue:e.userName,"onUpdate:modelValue":a[0]||(a[0]=s=>e.userName=s)},null,8,["modelValue"])]),t("div",F,[t("div",M,[o(n,{for:"firstName"},{default:l(()=>[r("First Name")]),_:1}),o(i,{id:"firstName",type:"text",autocomplete:"given-name",placeholder:"John",required:"",modelValue:e.firstName,"onUpdate:modelValue":a[1]||(a[1]=s=>e.firstName=s)},null,8,["modelValue"])]),t("div",z,[o(n,{for:"lastName"},{default:l(()=>[r("Last Name")]),_:1}),o(i,{id:"lastName",type:"text",autocomplete:"family-name",placeholder:"Appleseed",required:"",modelValue:e.lastName,"onUpdate:modelValue":a[2]||(a[2]=s=>e.lastName=s)},null,8,["modelValue"])])]),t("div",T,[o(n,{for:"email"},{default:l(()=>[r("Email")]),_:1}),o(i,{id:"email",type:"email",autocomplete:"email",placeholder:"Example@email.com",required:"",modelValue:e.email,"onUpdate:modelValue":a[3]||(a[3]=s=>e.email=s)},null,8,["modelValue"])]),t("div",W,[o(n,{for:"phoneNumber"},{default:l(()=>[r("Phone Number")]),_:1}),o(i,{id:"phoneNumber",type:"tel",autocomplete:"tel",placeholder:"0412-345-678",required:"",modelValue:e.phoneNumber,"onUpdate:modelValue":a[4]||(a[4]=s=>e.phoneNumber=s)},null,8,["modelValue"])]),t("div",H,[o(n,{for:"dateOfBirth"},{default:l(()=>[r("Date of Birth")]),_:1}),o(i,{id:"dateOfBirth",type:"date",autocomplete:"bday",required:"",modelValue:e.dateOfBirth,"onUpdate:modelValue":a[5]||(a[5]=s=>e.dateOfBirth=s)},null,8,["modelValue"])]),t("div",J,[t("div",R,[t("div",Y,[o(n,{for:"password"},{default:l(()=>[r("Password")]),_:1})]),o(i,{id:"password",type:"password",autocomplete:"new-password",placeholder:"Password",required:"",modelValue:e.password,"onUpdate:modelValue":a[6]||(a[6]=s=>e.password=s)},null,8,["modelValue"])]),t("div",Z,[t("div",K,[o(n,{for:"confirmPassword"},{default:l(()=>[r("Confirm Password")]),_:1})]),o(i,{id:"confirmPassword",type:"password",autocomplete:"new-password",placeholder:"Password",required:"",modelValue:e.confirmPassword,"onUpdate:modelValue":a[7]||(a[7]=s=>e.confirmPassword=s)},null,8,["modelValue"])])]),o(u,{type:"submit",class:"w-full",onClick:y(e.handleSignUp,["prevent"])},{default:l(()=>[r(" Sign up ")]),_:1},8,["onClick"]),o(u,{variant:"outline",class:"w-full",onClick:y(e.handleGoogleSignUp,["prevent"])},{default:l(()=>[r(" Sign up with Google ")]),_:1},8,["onClick"])]),t("div",Q,[r(" Already have an account? "),o(p,{to:"/login",class:"underline"},{default:l(()=>[r(" Login ")]),_:1})])])]),t("div",X,[o(b,{name:"fade",mode:"in-out","enter-active-class":"transition-opacity duration-1000","leave-active-class":"transition-opacity duration-1000","enter-from-class":"opacity-0","leave-to-class":"opacity-0"},{default:l(()=>[(N(),w("img",{key:e.currentImage,src:e.currentImage,alt:"Current Image",class:"object-cover w-full h-full absolute inset-0"},null,8,$))]),_:1}),t("img",{src:e.nextImage,alt:"Next Image",class:"object-cover w-full h-full absolute inset-0 opacity-0"},null,8,ee)])])}const ye=U(C,[["render",oe],["__scopeId","data-v-c5a4ec6b"]]);export{ye as default};
