import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Building2,
  Globe,
  Linkedin,
  Mail,
  Pencil,
  Phone,
  Save,
  X,
} from "lucide-react";
import { getProfile, updateProfile } from "./recruiterApi";
import type { CompanyProfileDto, UpdateCompanyDto } from "../shared/types";

interface FormState {
  companyName: string;
  industry: string;
  description: string;
  websiteLink: string;
  linkedInLink: string;
  whatsAppNumber: string;
  contactEmail: string;
}

interface FieldErrors {
  companyName?: string;
  industry?: string;
  [key: string]: string | undefined;
}

function profileToForm(profile: CompanyProfileDto): FormState {
  return {
    companyName: profile.companyName ?? "",
    industry: profile.industry ?? "",
    description: profile.description ?? "",
    websiteLink: profile.websiteLink ?? "",
    linkedInLink: profile.linkedInLink ?? "",
    whatsAppNumber: profile.whatsAppNumber ?? "",
    contactEmail: profile.contactEmail ?? "",
  };
}

export default function RecruiterProfilePage() {
  const [profile, setProfile] = useState<CompanyProfileDto | null>(null);
  const [form, setForm] = useState<FormState>({
    companyName: "",
    industry: "",
    description: "",
    websiteLink: "",
    linkedInLink: "",
    whatsAppNumber: "",
    contactEmail: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setProfile(data);
        setForm(profileToForm(data));
      })
      .catch(() => setServerError("Failed to load profile. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    if (fieldErrors[id]) {
      setFieldErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  }

  function validate(): boolean {
    const errors: FieldErrors = {};
    const name = form.companyName.trim();
    if (!name) {
      errors.companyName = "Company name is required.";
    } else if (name.length > 150) {
      errors.companyName = "Company name must be at most 150 characters.";
    }
    if (!form.industry.trim()) {
      errors.industry = "Industry is required.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleCancel() {
    if (profile) setForm(profileToForm(profile));
    setFieldErrors({});
    setServerError("");
    setEditMode(false);
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSaving(true);
    try {
      const dto: UpdateCompanyDto = {
        companyName: form.companyName.trim(),
        industry: form.industry.trim(),
      };
      if (form.description.trim()) dto.description = form.description.trim();
      if (form.websiteLink.trim()) dto.websiteLink = form.websiteLink.trim();
      if (form.linkedInLink.trim()) dto.linkedInLink = form.linkedInLink.trim();
      if (form.whatsAppNumber.trim()) dto.whatsAppNumber = form.whatsAppNumber.trim();
      if (form.contactEmail.trim()) dto.contactEmail = form.contactEmail.trim();

      const updated = await updateProfile(dto);
      setProfile(updated);
      setForm(profileToForm(updated));
      setEditMode(false);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          status?: number;
          data?: { errors?: Record<string, string[]>; message?: string };
        };
      };
      if (axiosErr.response?.data?.errors) {
        const serverFieldErrors: FieldErrors = {};
        for (const [f, msgs] of Object.entries(axiosErr.response.data.errors)) {
          const key = f.charAt(0).toLowerCase() + f.slice(1);
          serverFieldErrors[key] = (msgs as string[])[0];
        }
        setFieldErrors(serverFieldErrors);
      } else if (axiosErr.response?.data?.message) {
        setServerError(axiosErr.response.data.message);
      } else {
        setServerError("Failed to save changes. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-zinc-400">
          Loading profile…
        </div>
      </div>
    );
  }

  if (!profile && serverError) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="size-5" />
            <span>{serverError}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-[720px] mx-auto w-full px-6 py-10 flex flex-col gap-6">
        {/* Page heading */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-extrabold text-2xl text-zinc-950 tracking-tight">
              Company Profile
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Manage your company information visible to students.
            </p>
          </div>
          {!editMode && (
            <Button
              onClick={() => setEditMode(true)}
              className="rounded-xl bg-[#f0b100] text-white font-semibold h-9 px-4 hover:bg-[#d69e00]"
            >
              <Pencil className="size-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        {serverError && editMode && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="size-4 flex-shrink-0" />
            {serverError}
          </div>
        )}

        {/* VIEW MODE */}
        {!editMode && profile && (
          <>
            {/* Company header */}
            <Card className="rounded-2xl shadow-md bg-white border-zinc-200/80">
              <CardContent className="p-6 flex items-start gap-5">
                <div className="flex-shrink-0 rounded-xl bg-[#f0b100]/15 flex items-center justify-center w-14 h-14 text-[#f0b100]">
                  <Building2 className="size-7" />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="font-bold text-xl text-zinc-950 tracking-tight">
                    {profile.companyName}
                  </h2>
                  <p className="text-zinc-500 text-sm">{profile.industry}</p>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {profile.description && (
              <Card className="rounded-2xl shadow-md bg-white border-zinc-200/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-zinc-950">
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-zinc-600 text-sm leading-relaxed whitespace-pre-line">
                    {profile.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Contact & Links */}
            <Card className="rounded-2xl shadow-md bg-white border-zinc-200/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-zinc-950">
                  Contact &amp; Links
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex flex-col gap-3">
                {profile.contactEmail && (
                  <ContactRow
                    icon={<Mail className="size-4 text-[#f0b100]" />}
                    label="Email"
                  >
                    <a
                      href={`mailto:${profile.contactEmail}`}
                      className="text-zinc-700 hover:underline text-sm"
                    >
                      {profile.contactEmail}
                    </a>
                  </ContactRow>
                )}
                {profile.whatsAppNumber && (
                  <ContactRow
                    icon={<Phone className="size-4 text-[#f0b100]" />}
                    label="WhatsApp"
                  >
                    <span className="text-zinc-700 text-sm">
                      {profile.whatsAppNumber}
                    </span>
                  </ContactRow>
                )}
                {profile.linkedInLink && (
                  <ContactRow
                    icon={<Linkedin className="size-4 text-[#f0b100]" />}
                    label="LinkedIn"
                  >
                    <a
                      href={profile.linkedInLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-700 hover:underline text-sm truncate"
                    >
                      {profile.linkedInLink}
                    </a>
                  </ContactRow>
                )}
                {profile.websiteLink && (
                  <ContactRow
                    icon={<Globe className="size-4 text-[#f0b100]" />}
                    label="Website"
                  >
                    <a
                      href={profile.websiteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-700 hover:underline text-sm truncate"
                    >
                      {profile.websiteLink}
                    </a>
                  </ContactRow>
                )}
                {!profile.contactEmail && !profile.whatsAppNumber &&
                  !profile.linkedInLink && !profile.websiteLink && (
                    <p className="text-zinc-400 text-sm italic">
                      No contact info added yet.
                    </p>
                  )}
              </CardContent>
            </Card>
          </>
        )}

        {/* EDIT MODE */}
        {editMode && (
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            {/* Company basics */}
            <Card className="rounded-2xl shadow-md bg-white border-zinc-200/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-zinc-950">
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex flex-col gap-4">
                <FormField
                  id="companyName"
                  label="Company Name"
                  required
                  error={fieldErrors.companyName}
                >
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Acme Corp"
                    value={form.companyName}
                    onChange={handleChange}
                    maxLength={150}
                    className="rounded-xl bg-zinc-50 border-zinc-200 h-10 text-sm focus-visible:ring-2 focus-visible:ring-[#f0b100]"
                  />
                </FormField>

                <FormField
                  id="industry"
                  label="Industry"
                  required
                  error={fieldErrors.industry}
                >
                  <Input
                    id="industry"
                    type="text"
                    placeholder="Software / Technology"
                    value={form.industry}
                    onChange={handleChange}
                    className="rounded-xl bg-zinc-50 border-zinc-200 h-10 text-sm focus-visible:ring-2 focus-visible:ring-[#f0b100]"
                  />
                </FormField>

                <FormField id="description" label="About the Company">
                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Tell students about your company, culture, and what you're looking for…"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#f0b100] resize-none"
                  />
                </FormField>
              </CardContent>
            </Card>

            {/* Links */}
            <Card className="rounded-2xl shadow-md bg-white border-zinc-200/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-zinc-950">
                  Links
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex flex-col gap-4">
                <FormField id="websiteLink" label="Website">
                  <Input
                    id="websiteLink"
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={form.websiteLink}
                    onChange={handleChange}
                    className="rounded-xl bg-zinc-50 border-zinc-200 h-10 text-sm focus-visible:ring-2 focus-visible:ring-[#f0b100]"
                  />
                </FormField>

                <FormField id="linkedInLink" label="LinkedIn">
                  <Input
                    id="linkedInLink"
                    type="url"
                    placeholder="https://linkedin.com/company/yourcompany"
                    value={form.linkedInLink}
                    onChange={handleChange}
                    className="rounded-xl bg-zinc-50 border-zinc-200 h-10 text-sm focus-visible:ring-2 focus-visible:ring-[#f0b100]"
                  />
                </FormField>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="rounded-2xl shadow-md bg-white border-zinc-200/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-zinc-950">
                  Contact Info
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex flex-col gap-4">
                <FormField id="contactEmail" label="Contact Email">
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="hr@yourcompany.com"
                    value={form.contactEmail}
                    onChange={handleChange}
                    className="rounded-xl bg-zinc-50 border-zinc-200 h-10 text-sm focus-visible:ring-2 focus-visible:ring-[#f0b100]"
                  />
                </FormField>

                <FormField id="whatsAppNumber" label="WhatsApp Number">
                  <Input
                    id="whatsAppNumber"
                    type="text"
                    placeholder="+20 10 XXXX XXXX"
                    value={form.whatsAppNumber}
                    onChange={handleChange}
                    className="rounded-xl bg-zinc-50 border-zinc-200 h-10 text-sm focus-visible:ring-2 focus-visible:ring-[#f0b100]"
                  />
                </FormField>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-zinc-200 font-medium text-sm text-zinc-700 h-10 px-5 hover:bg-zinc-50"
                onClick={handleCancel}
              >
                <X className="size-4 mr-1" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#f0b100] text-white font-semibold h-10 px-6 hover:bg-[#d69e00] disabled:opacity-60"
              >
                <Save className="size-4 mr-2" />
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex-shrink-0">{icon}</span>
      <span className="text-zinc-400 text-xs w-24 flex-shrink-0">{label}</span>
      <span className="flex-1 min-w-0">{children}</span>
    </div>
  );
}

function FormField({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-sm font-semibold text-zinc-800">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="size-3" />
          {error}
        </p>
      )}
    </div>
  );
}
