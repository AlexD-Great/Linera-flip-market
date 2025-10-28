'use client';

import { Github, Twitter, Globe, Zap, BookOpen, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Linera */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              About Linera
            </h3>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              Linera is a next-generation blockchain platform featuring microchains 
              for instant, scalable, and low-cost decentralized applications.
            </p>
            <div className="flex gap-3">
              <a
                href="https://linera.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors text-sm"
              >
                <Globe className="w-4 h-4" />
                Website
              </a>
              <a
                href="https://linera.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors text-sm"
              >
                <BookOpen className="w-4 h-4" />
                Docs
              </a>
              <a
                href="https://github.com/linera-io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors text-sm"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>

          {/* About This Project */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-pink-400" />
              Linera Flip Market
            </h3>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              A decentralized coin flip betting platform showcasing Linera's 
              instant finality and zero-latency transactions. Built for the 
              Linera Buildathon.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/AlexD-Great/Linera-flip-market"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-pink-400 hover:text-pink-300 transition-colors text-sm"
              >
                <Github className="w-4 h-4" />
                Source Code
              </a>
            </div>
          </div>

          {/* Developer Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Github className="w-5 h-5 text-green-400" />
              Developer
            </h3>
            <p className="text-gray-400 mb-2 text-sm">
              <span className="font-semibold text-white">AlexD-Great</span>
            </p>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              Blockchain developer passionate about building decentralized 
              applications and exploring cutting-edge Web3 technologies.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/AlexD-Great"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors text-sm"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a
                href="https://twitter.com/AlexD_Great"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors text-sm"
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 Linera Flip Market. Built with ⚡ on Linera.
          </p>
          <div className="flex gap-6 text-sm">
            <a
              href="https://linera.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Powered by Linera
            </a>
            <a
              href="https://github.com/AlexD-Great/Linera-flip-market/blob/main/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Documentation
            </a>
            <a
              href="https://github.com/AlexD-Great/Linera-flip-market/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Report Issue
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
