
import React, { useState, useEffect } from 'react';
import { Globe, Shield, Wifi, Copy } from 'lucide-react';

export const IpTool: React.FC = () => {
  const [publicIp, setPublicIp] = useState<string>('正在获取...');
  const [localIp, setLocalIp] = useState<string>('正在获取...');
  const [ipDetails, setIpDetails] = useState<any>(null);

  const isPrivateIp = (ip: string) => {
    return /^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.|127\.)/.test(ip);
  };

  useEffect(() => {
    const fetchIp = async () => {
      // 1. Try IP.SB
      try {
        const res = await fetch('https://api.ip.sb/geoip', { headers: { 'Content-Type': 'application/json' } });
        if (res.ok) {
          const data = await res.json();
          if (!isPrivateIp(data.ip)) {
            setPublicIp(data.ip);
            setIpDetails({
              city: data.city,
              region: data.region,
              country_name: data.country,
              org: data.isp || data.organization,
              asn: data.asn
            });
            return;
          }
        }
      } catch (e) { console.warn('IP.SB failed', e); }

      // 2. Try ipapi.co
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          if (!isPrivateIp(data.ip)) {
            setPublicIp(data.ip);
            setIpDetails(data);
            return;
          }
        }
      } catch (e) { console.warn('ipapi failed', e); }

      // 3. Fallback to Cloudflare Trace (Very reliable for raw IP)
      try {
        const res = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
        if (res.ok) {
          const text = await res.text();
          const ipMatch = text.match(/ip=(.+)/);
          if (ipMatch && ipMatch[1] && !isPrivateIp(ipMatch[1])) {
            setPublicIp(ipMatch[1]);
            setIpDetails({ org: 'Cloudflare Trace (No Location Data)' });
            return;
          }
        }
      } catch (e) { console.warn('Cloudflare trace failed', e); }

      setPublicIp('获取失败');
    };

    fetchIp();

    // Get Local IP via WebRTC
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel('');
    pc.createOffer().then(offer => pc.setLocalDescription(offer));
    pc.onicecandidate = (ice) => {
      if (!ice || !ice.candidate || !ice.candidate.candidate) return;
      const myIp = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(ice.candidate.candidate)?.[1];
      if (myIp) setLocalIp(myIp);
    };
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Public IP */}
        <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl relative overflow-hidden group">
          <Globe className="absolute -right-4 -bottom-4 w-32 h-32 text-primary/5 group-hover:text-primary/10 transition-colors" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <span className="p-2 bg-primary/10 rounded-lg text-primary">
                <Globe className="w-5 h-5" />
              </span>
              <button onClick={() => copyToClipboard(publicIp)} className="p-2 hover:bg-primary/10 rounded-full transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">公网 IP 地址</h3>
            <p className="text-3xl font-mono font-black">{publicIp}</p>
            {ipDetails && (
              <div className="mt-4 space-y-1 text-xs text-muted-foreground font-medium">
                <p>位置: {ipDetails.city}, {ipDetails.region}, {ipDetails.country_name}</p>
                <p>运营商: {ipDetails.org}</p>
              </div>
            )}
          </div>
        </div>

        {/* Local IP */}
        <div className="p-6 bg-secondary/30 border border-border rounded-2xl relative overflow-hidden group">
          <Wifi className="absolute -right-4 -bottom-4 w-32 h-32 text-muted/5 group-hover:text-muted/10 transition-colors" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <span className="p-2 bg-secondary rounded-lg">
                <Wifi className="w-5 h-5" />
              </span>
              <button onClick={() => copyToClipboard(localIp)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">内网 IP 地址</h3>
            <p className="text-3xl font-mono font-black">{localIp}</p>
            <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
              内网 IP 仅在局域网内可见。WebRTC 探测技术可能因浏览器安全限制而无法获取。
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border border-dashed border-border">
        <Shield className="w-8 h-8 text-green-500/50" />
        <div>
          <h4 className="text-sm font-bold">隐私安全</h4>
          <p className="text-xs text-muted-foreground">您的 IP 信息仅用于本地展示，我们不会在服务器端记录您的任何访问数据。</p>
        </div>
      </div>
    </div>
  );
};
