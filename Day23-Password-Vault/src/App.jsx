import { useState, useEffect, useRef } from "react";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";

const ENCRYPTION_KEY = "@vault-key";
const PIN_KEY = "vault-pin";
const PIN_RECOVERY_KEY = "vault-hint";

function encrypt(text) {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

function decrypt(cipher) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return "Invalid";
  }
}

export default function PasswordVault() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinHint, setPinHint] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [hasAccount, setHasAccount] = useState(null); // null = undecided

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("vault-notes");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({ title: "", content: "", tags: "" });
  const [showIds, setShowIds] = useState([]);
  const [filterTag, setFilterTag] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsLocked(true), 2 * 60 * 1000);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown"];
    const resetHandler = () => resetTimeout();
    events.forEach(e => window.addEventListener(e, resetHandler));
    resetTimeout();
    return () => events.forEach(e => window.removeEventListener(e, resetHandler));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("🔁 Syncing to dummy backend:", notes);
    }
  }, [notes]);

  const handleAdd = () => {
    if (!form.title || !form.content) return;
    const newNote = {
      id: uuidv4(),
      title: form.title,
      tags: form.tags.split(",").map(t => t.trim()),
      encrypted: encrypt(form.content),
      createdAt: new Date().toISOString()
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    localStorage.setItem("vault-notes", JSON.stringify(updated));
    setForm({ title: "", content: "", tags: "" });
  };

  const handleDelete = (id) => {
    const updated = notes.filter(note => note.id !== id);
    setNotes(updated);
    localStorage.setItem("vault-notes", JSON.stringify(updated));
  };

  const filteredNotes = filterTag
    ? notes.filter(n => n.tags.includes(filterTag))
    : notes;

  if (hasAccount === null) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold mb-6">🔐 Welcome to Password Vault</h2>
        <button
          className="bg-blue-600 px-6 py-2 rounded mb-4"
          onClick={() => setHasAccount(false)}
        >
          I'm New - Set PIN
        </button>
        <button
          className="bg-white/10 px-6 py-2 rounded"
          onClick={() => setHasAccount(true)}
        >
          I Have an Account - Unlock
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    const isNewUser = hasAccount === false;
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold mb-4">
          {isNewUser ? "🔐 Set Your Vault PIN" : "🔐 Enter Your Vault PIN"}
        </h2>

        <input
          type="password"
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value)}
          placeholder="Enter PIN"
          className="bg-white/10 px-4 py-2 rounded text-center mb-4"
        />

        {isNewUser && (
          <input
            type="text"
            value={pinHint}
            onChange={(e) => setPinHint(e.target.value)}
            placeholder="Set PIN Hint (optional)"
            className="bg-white/10 px-4 py-2 rounded text-center mb-4"
          />
        )}

        <button
          className="bg-blue-600 px-6 py-2 rounded mb-2"
          onClick={() => {
            if (isNewUser) {
              localStorage.setItem(PIN_KEY, pinInput);
              if (pinHint) localStorage.setItem(PIN_RECOVERY_KEY, pinHint);
              setIsAuthenticated(true);
            } else {
              const stored = localStorage.getItem(PIN_KEY);
              if (stored === pinInput) {
                setIsAuthenticated(true);
              } else {
                alert("❌ Incorrect PIN");
              }
            }
          }}
        >
          {isNewUser ? "Set PIN" : "Unlock"}
        </button>

        {!isNewUser && (
          <button
            className="text-sm underline text-white/60"
            onClick={() => setShowHint(!showHint)}
          >
            Forgot PIN?
          </button>
        )}

        {showHint && (
          <p className="mt-2 text-white/50">Hint: {localStorage.getItem(PIN_RECOVERY_KEY) || "(No hint set)"}</p>
        )}
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
        <button
          onClick={() => setIsLocked(false)}
          className="px-6 py-3 bg-blue-600 rounded-lg"
        >
          🔐 Unlock Vault
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-zinc-900 via-slate-900 to-black p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🔐 Password Vault</h1>
        <button
          onClick={() => {
            setIsAuthenticated(false);
            setPinInput("");
            setHasAccount(null);
          }}
          className="text-red-400 underline"
        >
          Lock & Exit
        </button>
      </div>

      <div className="bg-white/10 p-4 rounded-lg mb-6 flex flex-col gap-2">
        <input
          className="bg-black/30 px-3 py-2 rounded"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="bg-black/30 px-3 py-2 rounded"
          placeholder="Password or Note"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <input
          className="bg-black/30 px-3 py-2 rounded"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mt-2"
        >
          ➕ Add Secure Note
        </button>
      </div>

      <div className="mb-4">
        <label className="mr-2">Filter by Tag:</label>
        <input
          className="bg-black/20 px-2 py-1 rounded"
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
        />
        <button onClick={() => setFilterTag("")} className="ml-2 text-sm underline">Reset</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map(note => (
          <div
            key={note.id}
            className="bg-white/10 rounded-lg p-4 relative group"
          >
            <h2 className="text-lg font-semibold mb-1">{note.title}</h2>
            <div className="text-sm mb-2 text-white/70">Tags: {note.tags.join(", ")}</div>
            <div
              className="cursor-pointer mb-3 text-white/90"
              onClick={() => {
                if (showIds.includes(note.id)) {
                  setShowIds(showIds.filter(id => id !== note.id));
                } else {
                  navigator.clipboard.writeText(decrypt(note.encrypted));
                  setShowIds([...showIds, note.id]);
                }
              }}
            >
              {showIds.includes(note.id) ? decrypt(note.encrypted) : "👁️ Click to Reveal / Copy"}
            </div>
            <button
              onClick={() => handleDelete(note.id)}
              className="text-red-400 text-sm underline absolute top-2 right-3 hidden group-hover:block"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
