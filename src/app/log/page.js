// "use client";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// import { loginUser } from "@/redux/slices/authSlice";

// export default function LoginPage() {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const { user, loading, error } = useSelector((state) => state.auth);

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = (e) => {
//     e.preventDefault();
//     dispatch(loginUser({ userName: username, uPassword: password }));
//   };

//   useEffect(() => {
//     if (user) {
//       const role = user.roleName?.toLowerCase();
//       if (role === "nsp") {
//         router.push("/test");
//       } else if (role === "manager") {
//         router.push("/manager/home");
//       } else if (role === "technician") {
//         router.push("/technician/jobs");
//       } else {
//         router.push("/test");
//       }
//     }
//   }, [user, router]);

//   return (
//     <div className="container">
//       <div className="top"></div>
//       <div className="bottom"></div>
//       <div className="center">
//         <Image src="/logo.jpg" alt="Dashboard Logo" width={150} height={100} />
//         <h2>Please Sign In</h2>

//         <form onSubmit={handleLogin} className="w-full">
//           <input
//             type="text"
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="input-field"
//             required
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="input-field"
//             required
//           />

//           <button type="submit" className="btn-login" disabled={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         {error && <p className="error-message">{error}</p>}
//       </div>

//       {/* Keep your fancy animated background styles */}
//       <style jsx>{`
//         *,
//         *:before,
//         *:after {
//           box-sizing: border-box;
//         }

//         // body, html {
//         //   min-height: 100vh;
//         //   font-family: "Raleway", sans-serif;
//         //   margin: 0;
//         //   overflow: hidden;
//         // }

//         .container {
//           // position: relative;
//           width: 100%;
//           height: 100%;
//           overflow: hidden;
//           scroll: block;
//         }

//         .container:hover .top:before,
//         .container:hover .top:after,
//         .container:hover .bottom:before,
//         .container:hover .bottom:after,
//         .container:active .top:before,
//         .container:active .top:after,
//         .container:active .bottom:before,
//         .container:active .bottom:after {
//           margin-left: 200px;
//           transform-origin: -200px 50%;
//           transition-delay: 0s;
//         }

//         .container:hover .center,
//         .container:active .center {
//           opacity: 1;
//           transition-delay: 0.2s;
//         }

//         .top:before,
//         .top:after,
//         .bottom:before,
//         .bottom:after {
//           content: "";
//           display: block;
//           position: absolute;
//           width: 200vmax;
//           height: 200vmax;
//           top: 50%;
//           left: 50%;
//           margin-top: -100vmax;
//           transform-origin: 0 50%;
//           transition: all 0.5s cubic-bezier(0.445, 0.05, 0, 1);
//           z-index: 10;
//           opacity: 0.65;
//           transition-delay: 0.2s;
//         }

//         .top:before {
//           transform: rotate(45deg);
//           background: #e46569;
//         }
//         .top:after {
//           transform: rotate(135deg);
//           background: #ecaf81;
//         }

//         .bottom:before {
//           transform: rotate(-45deg);
//           background: #60b8d4;
//         }
//         .bottom:after {
//           transform: rotate(-135deg);
//           background: #714b67;
//         }

//         .center {
//           position: absolute;
//           width: 400px;
//           height: 400px;
//           top: 50%;
//           left: 50%;
//           margin-left: -200px;
//           margin-top: -200px;
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//           align-items: center;
//           padding: 30px;
//           opacity: 0;
//           transition: all 0.5s cubic-bezier(0.445, 0.05, 0, 1);
//           transition-delay: 1.5s;
//           color: #333;
//         }

//         .input-field {
//           width: 100%;
//           padding: 15px;
//           margin: 5px 0;
//           border: 1px solid #ccc;
//           border-radius: 2px;
//           font-family: inherit;
//         }

//         .btn-login {
//           width: 100%;
//           padding: 15px;
//           margin-top: 10px;
//           border: none;
//           background: #714b67;
//           color: white;
//           font-size: 16px;
//           cursor: pointer;
//           transition: background 0.3s;
//         }

//         .btn-login:hover {
//           background: #714b67;
//         }

//         .error-message {
//           color: red;
//           margin-top: 10px;
//         }
//       `}</style>
//     </div>
//   );
// }
