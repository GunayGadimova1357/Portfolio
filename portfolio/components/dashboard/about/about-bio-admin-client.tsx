"use client";

import {useEffect} from "react";
import {Controller, useForm} from "react-hook-form";
import {DashboardField} from "@/components/dashboard/shared/form-fields";
import {DashboardPageIntro} from "@/components/dashboard/shared/page-intro";
import {getErrorMessage} from "@/components/dashboard/shared/error-message";
import {DashboardStatusBadge} from "@/components/dashboard/shared/status-badge";
import {useStatusMessage} from "@/components/dashboard/shared/use-status-message";
import {requestJson} from "@/lib/dashboard/client";
import {parseAboutBio, type AboutBioRecord} from "@/lib/about-schema";

type AboutResponse = {bio: AboutBioRecord};

const bioFields: Array<{
  name: keyof AboutBioRecord;
  label: string;
}> = [
  {name: "en", label: "English bio"},
  {name: "ru", label: "Russian bio"},
  {name: "az", label: "Azerbaijani bio"},
];

export function AboutBioAdminClient({initialBio}: {initialBio: AboutBioRecord}) {
  const {status, showStatus} = useStatusMessage();
  const {control, handleSubmit, reset} = useForm<AboutBioRecord>({
    defaultValues: initialBio,
  });

  useEffect(() => {
    reset(initialBio);
  }, [initialBio, reset]);

  async function saveBio(bio: AboutBioRecord) {
    try {
      const data = await requestJson<AboutResponse>("/api/dashboard/about", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(parseAboutBio(bio)),
      });

      reset(data.bio);
      showStatus("Bio saved.");
    } catch (error) {
      showStatus(getErrorMessage(error, "Failed to save bio."));
    }
  }

  return (
    <>
      <DashboardPageIntro
        eyebrow="About"
        title="Short bio"
        description="Edit the short bio text used on the public about page for each locale."
        action={status ? <DashboardStatusBadge>{status}</DashboardStatusBadge> : null}
      />

      <section className="rounded-[2rem] border border-white/10 bg-[#101015] p-6 md:p-8">
        <form onSubmit={handleSubmit(saveBio)} className="space-y-4">
          {bioFields.map(({name, label}) => (
            <Controller
              key={name}
              name={name}
              control={control}
              render={({field}) => (
                <DashboardField
                  label={label}
                  name={`bio-${name}`}
                  value={field.value}
                  onChange={field.onChange}
                  multiline
                  rows={5}
                />
              )}
            />
          ))}

          <button
            type="submit"
            className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            Save bio
          </button>
        </form>
      </section>
    </>
  );
}
