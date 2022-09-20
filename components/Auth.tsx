import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Button, Input } from "@chakra-ui/react";
import SignIn from "./Elements/SignIn";
import SignUp from "./Elements/SignUp";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row flex-center flex">
      <div className="col-6 form-widget">
        <h1 className="header">Haunt Tracker</h1>
        <p className="description">
          Sign in via magic link with your email below
        </p>
        <div>
          <Input
            className="inputField"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleLogin(email);
            }}
            className="button block"
            disabled={loading}
            colorScheme="blue"
          >
            <span>{loading ? "Loading" : "Send magic link"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
