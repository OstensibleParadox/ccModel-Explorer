\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{lawreview}[Custom Law Review Class]

\LoadClass[12pt,letterpaper]{article}

% --- Packages ---
\RequirePackage[utf8]{inputenc}
\RequirePackage[T1]{fontenc}
\RequirePackage{ebgaramond}
\RequirePackage{geometry}
\RequirePackage{fancyhdr}
\RequirePackage{titlesec}
\RequirePackage{etoolbox}
\RequirePackage{setspace}
\RequirePackage{titling}
\RequirePackage{abstract}

% --- Geometry ---
\geometry{
    letterpaper,
    top=1.2in,
    bottom=1.2in,
    left=1.25in,
    right=1.25in,
    headsep=0.3in,
    footskip=0.5in
}

% --- Custom Commands ---
\newcommand{\shorttitle}[1]{\def\@shorttitle{#1}}
\newcommand{\journalcite}[1]{\def\@journalcite{#1}}
\newcommand{\volume}[1]{\def\@volume{#1}}
\newcommand{\pubdate}[1]{\def\@pubdate{#1}}
\newcommand{\articletype}[1]{\def\@articletype{#1}}

% Defaults (Generic)
\shorttitle{Short Title}
\journalcite{00 JOURNAL L. REV. 000 (20XX)}
\volume{Volume 00}
\pubdate{Month Year}
\articletype{ARTICLE}

% --- Header/Footer Styles ---
\fancypagestyle{plain}{ % First page
    \fancyhf{}
    \fancyhead[L]{\MakeUppercase{\@volume}}
    \fancyhead[R]{\MakeUppercase{\@pubdate}}
    \fancyfoot[C]{\thepage}
    \renewcommand{\headrulewidth}{0.4pt}
    \renewcommand{\footrulewidth}{0pt}
}

\fancypagestyle{standard}{ % Subsequent pages
    \fancyhf{}
    \fancyhead[C]{%
        \itshape\@shorttitle \\
        \normalfont\small\@journalcite \\
        \vspace{1em}
        \normalfont\thepage
    }
    \renewcommand{\headrulewidth}{0pt}
    \renewcommand{\footrulewidth}{0pt}
}

\pagestyle{standard}

% --- Title Block ---
\renewcommand{\maketitle}{
    \thispagestyle{plain}
    \begin{center}
        \vspace*{1em}
        {\small\MakeUppercase{\@articletype}} \\
        \vspace{2em}
        {\LARGE\bfseries\@title} \\
        \vspace{2em}
        {\large\itshape\@author} \\
        \vspace{2em}
    \end{center}
}

% --- Abstract ---
\renewenvironment{abstract}{
    \list{}{\leftmargin=0in\rightmargin=0in}
    \item[]\relax
    {\bfseries Abstract.}
}{\endlist\vspace{1em}}

% --- Section Headings ---
% Roman numerals for sections: I. TITLE
\titleformat{\section}[block]
  {\normalfont\large\bfseries\centering}{\Roman{section}.}{1em}{\MakeUppercase}

% Capital letters for subsections: A. Title
\titleformat{\subsection}[block]
  {\normalfont\normalsize\bfseries}{\Alph{subsection}.}{1em}{}

% Numbers for sub-subsections: 1. Title
\titleformat{\subsubsection}[block]
  {\normalfont\normalsize\itshape}{\arabic{subsubsection}.}{1em}{}

% --- Paragraph Styling ---
\setstretch{1.1}
\setlength{\parindent}{2em}
\setlength{\parskip}{0pt}

% --- Footnotes ---
\renewcommand{\footnoterule}{%
  \kern -3pt
  \hrule width 0.4\columnwidth
  \kern 2.6pt
}

\endinput
