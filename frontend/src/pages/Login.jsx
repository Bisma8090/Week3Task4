import React, { useState, useRef, useEffect } from "react";
import {
  Box, TextField, Button, Typography,
  CircularProgress, Paper, Divider, InputAdornment, IconButton
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { gsap } from "gsap";
import api, { setToken } from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(formRef.current, 
      { opacity: 0, scale: 0.9, y: 30 }, 
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power4.out" }
    );
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Please fill all fields");
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      setToken(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      gsap.fromTo(formRef.current, { x: -10 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)", keyframes: { x: [-10, 10, -10, 10, 0] } });
    } finally {
      setLoading(false);
    }
  };

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    borderRadius: 4,
    bgcolor: "rgba(255,255,255,0.03)", 
    
    "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
    "&.Mui-focused fieldset": { borderColor: "#4F8EF7" },

    // 🔥 Autofill Transparent Fix
    "& input:-webkit-autofill": {
      // Is se background color force hide ho jata hai
      WebkitBoxShadow: "0 0 0 100px transparent inset !important", 
      WebkitTextFillColor: "#fff !important",
      // Background color change hone ki speed ko itna slow kar dete hain ke wo transparent hi lagta hai
      transition: "background-color 50000s ease-in-out 0s",
    },
    "& input:-webkit-autofill:hover": {
      WebkitBoxShadow: "0 0 0 100px transparent inset !important",
    },
    "& input:-webkit-autofill:focus": {
      WebkitBoxShadow: "0 0 0 100px transparent inset !important",
    },
    "& input:-webkit-autofill:active": {
      WebkitBoxShadow: "0 0 0 100px transparent inset !important",
    },
  },

  "& .MuiInputAdornment-root": {
    backgroundColor: "transparent !important", 
    margin: 0,
    padding: "0 8px",
  },

  "& .MuiIconButton-root": {
    backgroundColor: "transparent !important",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.05) !important", 
    }
  },

  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.5)" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#4F8EF7" }
};

  return (
    <Box sx={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(circle at 50% 50%, #1a1f38 0%, #0f1117 100%)",
      px: { xs: 2, sm: 3 }
    }}>
      <Paper ref={formRef} elevation={0} sx={{
        width: "100%", maxWidth: 400, p: { xs: 3, sm: 5 }, borderRadius: 6,
        background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
      }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight={800} sx={{ 
            fontSize: { xs: "1.8rem", sm: "2.125rem" },
            background: "linear-gradient(135deg, #4F8EF7 0%, #7C3AED 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", mb: 1
          }}>
            🚀 TeamPortal
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.5)">
            Welcome back! Please enter your details.
          </Typography>
        </Box>

        {error && <Typography color="#F87171" variant="caption" display="block" textAlign="center" sx={{ mb: 2, bgcolor: "rgba(248, 113, 113, 0.1)", p: 1, borderRadius: 2 }}>{error}</Typography>}

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth label="Email Address" variant="outlined" margin="normal"
            value={email} onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Email sx={{ color: "rgba(255,255,255,0.3)" }} /></InputAdornment>,
            }}
            sx={inputStyle}
          />

          <TextField
            fullWidth label="Password" type={showPassword ? "text" : "password"} variant="outlined" margin="normal"
            value={password} onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Lock sx={{ color: "rgba(255,255,255,0.3)" }} /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: "rgba(255,255,255,0.3)" }}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ ...inputStyle, mb: { xs: 3, sm: 4 } }}
          />

          <Button
            fullWidth size="large" type="submit" variant="contained" disabled={loading}
            sx={{
              py: 1.5, borderRadius: 3, fontWeight: 700, textTransform: "none", fontSize: "1rem",
              background: "linear-gradient(135deg, #4F8EF7 0%, #7C3AED 100%)",
              boxShadow: "0 10px 20px -5px rgba(79, 142, 247, 0.4)",
              "&:hover": { opacity: 0.9 }
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Sign In"}
          </Button>
        </form>

        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.05)" }} />

        <Typography variant="body2" textAlign="center" color="rgba(255,255,255,0.4)">
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#4F8EF7", textDecoration: "none", fontWeight: 700 }}>Sign up</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;