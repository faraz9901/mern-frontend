import { type FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { UserService } from "../services/user.service";

type ProfileForm = {
  firstname: string;
  lastname: string;
  address: string;
};

function Edit() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState<ProfileForm>({
    firstname: "",
    lastname: "",
    address: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      address: user.address || "",
    });
  }, [user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.firstname.trim()) {
      toast.error("First name is required.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await UserService.updateProfile({
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim() || undefined,
        address: form.address.trim() || undefined,
      });

      if (response.success) {
        toast.success(response.message);
        await refreshUser();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(UserService.getMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-4 md:p-6 text-sm text-slate-300">
        <p className="text-base font-semibold text-white">Please log in to edit your profile.</p>
        <p className="mt-2 text-slate-400">
          This page allows you to adjust encrypted information stored in the database.
        </p>
        <Link
          to="/login"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-slate-200 transition hover:border-slate-500"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-4 md:p-6">
      <header>
        <p className="text-xs uppercase tracking-[0.5em] text-slate-500">Edit profile</p>
        <h2 className="text-xl md:text-2xl font-semibold text-white">
          Keep your details accurate
        </h2>
      </header>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <label className="block text-sm font-medium text-slate-200">
          First name
          <input
            className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
            value={form.firstname}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, firstname: event.target.value }))
            }
            required
          />
        </label>

        <label className="block text-sm font-medium text-slate-200">
          Last name
          <input
            className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
            value={form.lastname}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, lastname: event.target.value }))
            }
          />
        </label>

        <label className="block text-sm font-medium text-slate-200">
          Address
          <input
            className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
            value={form.address}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, address: event.target.value }))
            }
          />
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving…" : "Save changes"}
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto rounded-2xl border border-slate-700 px-4 py-2 text-sm text-center font-semibold text-slate-200 transition hover:border-slate-500"
          >
            Back to dashboard
          </Link>
        </div>
      </form>
    </section>
  );
}

export default Edit;
