"use client";

import {useEffect} from "react";
import {Controller, useForm} from "react-hook-form";
import {DashboardField} from "@/components/dashboard/shared/form-fields";
import {DashboardPageIntro} from "@/components/dashboard/shared/page-intro";
import {useStatusMessage} from "@/components/dashboard/shared/use-status-message";
import {requestJson} from "@/lib/dashboard/client";
import {parseAboutBio, type AboutBioRecord} from "@/lib/about-schema";

type AboutResponse = {bio: AboutBioRecord};

export function AboutBioAdminClient({initialBio}: {initialBio: AboutBioRecord}) {
  const {status, showStatus} = useStatusMessage();
  // Одна форма управляет всеми локализованными версиями короткого био.
  const {control, handleSubmit, reset} = useForm<AboutBioRecord>({
    defaultValues: initialBio,
  });

  useEffect(() => {
    // Если сервер отдал новое состояние, синхронизируем форму с ним.
    reset(initialBio);
  }, [initialBio, reset]);

  async function saveBio(bio: AboutBioRecord) {
    try {
      const data = await requestJson<AboutResponse>("/api/dashboard/about", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(parseAboutBio(bio)),
      });

      // После сохранения фиксируем актуальные данные как исходное состояние формы.
      reset(data.bio);
      showStatus("Bio saved.");
    } catch (error) {
      showStatus(error instanceof Error ? error.message : "Failed to save bio.");
    }
  }

  return (
    <>
      <DashboardPageIntro
        eyebrow="About"
        title="Short bio"
        description="Edit the short bio text used on the public about page for each locale."
        action={
          status ? (
            <span className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/72">
              {status}
            </span>
          ) : null
        }
      />

      <section className="rounded-[2rem] border border-white/10 bg-[#101015] p-6 md:p-8">
        <form onSubmit={handleSubmit(saveBio)} className="space-y-4">
          <Controller
            name="en"
            control={control}
            render={({field}) => (
              <DashboardField
                label="English bio"
                name="bio-en"
                value={field.value}
                onChange={field.onChange}
                multiline
                rows={5}
              />
            )}
          />
          <Controller
            name="ru"
            control={control}
            render={({field}) => (
              <DashboardField
                label="Russian bio"
                name="bio-ru"
                value={field.value}
                onChange={field.onChange}
                multiline
                rows={5}
              />
            )}
          />
          <Controller
            name="az"
            control={control}
            render={({field}) => (
              <DashboardField
                label="Azerbaijani bio"
                name="bio-az"
                value={field.value}
                onChange={field.onChange}
                multiline
                rows={5}
              />
            )}
          />

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
