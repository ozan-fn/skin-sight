import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Twitter, Facebook, Mail } from "lucide-react";

export default function TentangKami() {
  const team = [
    {
      name: "Muhammad Zhiya Ulhaq",
      role: "Frontend Engineer",
      bio: "Fokus pada UI/UX, aksesibilitas, dan performa frontend — memastikan pengalaman pengguna halus di semua perangkat.",
      seed: "MuhammadZhiyaUlhaq",
    },
    {
      name: "Noval Esa Ramdany",
      role: "Backend Engineer",
      bio: "Membangun API, integrasi database, dan pipeline pemrosesan gambar — memastikan sistem andal dan aman.",
      seed: "NovalEsaRamdany",
    },
    {
      name: "Akhmad Fauzan",
      role: "Fullstack Engineer",
      bio: "Menjembatkan frontend dan backend: deployment, observability, dan orkestrasi fitur end-to-end.",
      seed: "AkhmadFauzan",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col justify-start pt-24 -mt-[20px]">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black">Tentang Kami</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
            Tim kecil yang berdedikasi di balik SkinSight — gabungan design,
            engineering, dan riset untuk menghadirkan solusi deteksi kulit yang
            cepat, privat, dan dapat diandalkan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {team.map((m) => (
            <Card key={m.name} className="rounded-lg shadow-md overflow-hidden">
              <CardContent className="flex flex-col items-center text-center p-6 gap-4">
                {/* larger square image, ngotak (not rounded) */}
                <div className="w-40 h-40 bg-muted overflow-hidden">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(m.seed)}`}
                    alt={m.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-lg md:text-xl font-bold mt-2">{m.name}</h3>
                <p className="text-sm text-primary font-semibold">{m.role}</p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {m.bio}
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-center p-4">
                <Button variant="outline" className="w-full">
                  Kontak & Lihat Profil
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Footer-like team block (bigger square photo + contact) */}
        <section className="mt-16">
          <Card className="rounded-lg shadow-lg overflow-hidden">
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* big square photo */}
                <div className="col-span-1 flex items-center justify-center">
                  <div className="w-56 h-56 bg-muted overflow-hidden">
                    <img
                      src="/team/group-placeholder.jpg"
                      alt="Team photo"
                      onError={(e) => {
                        // fallback to dicebear if no local image
                        // Note: inline onError used for resilience; if this file is missing the external will still show in dev
                        (e.currentTarget as HTMLImageElement).src =
                          "https://api.dicebear.com/7.x/identicon/svg?seed=skinsight-team";
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* contact / about */}
                <div className="col-span-2">
                  <h4 className="text-2xl font-black">
                    Ingin tahu lebih lanjut?
                  </h4>
                  <p className="mt-2 text-muted-foreground max-w-2xl">
                    Hubungi kami untuk demo, integrasi, atau kolaborasi riset.
                    Kami siap membantu Anda menerapkan solusi deteksi kulit yang
                    aman dan privasi-aware.
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        (window.location.href = "mailto:support@skinsight.ai")
                      }
                    >
                      <Mail className="mr-2" /> Email: support@skinsight.ai
                    </Button>

                    <div className="flex items-center gap-3 ml-0 sm:ml-4">
                      <Button
                        variant="ghost"
                        aria-label="Instagram"
                        onClick={() =>
                          window.open(
                            "https://instagram.com/skinsight",
                            "_blank",
                            "noopener,noreferrer",
                          )
                        }
                      >
                        <Instagram />
                      </Button>
                      <Button
                        variant="ghost"
                        aria-label="Twitter"
                        onClick={() =>
                          window.open(
                            "https://twitter.com/skinsight",
                            "_blank",
                            "noopener,noreferrer",
                          )
                        }
                      >
                        <Twitter />
                      </Button>
                      <Button
                        variant="ghost"
                        aria-label="Facebook"
                        onClick={() =>
                          window.open(
                            "https://facebook.com/skinsight",
                            "_blank",
                            "noopener,noreferrer",
                          )
                        }
                      >
                        <Facebook />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
