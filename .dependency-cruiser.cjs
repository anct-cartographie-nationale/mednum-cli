/** @type {import('dependency-cruiser').IConfiguration} */

const SPEC_FILES = '[.](?:spec|test)[.](?:js|mjs|cjs|ts|mts|cts)$';

const FORBIDDEN_GLOBAL = [
  {
    name: 'no-circular',
    severity: 'warn',
    comment:
      'This dependency is part of a circular relationship. You might want to revise your solution ' +
      '(i.e. use dependency inversion, make sure the modules have a single responsibility).',
    from: {},
    to: { circular: true }
  },
  {
    name: 'no-deprecated-core',
    severity: 'warn',
    comment: 'A module depends on a node core module that has been deprecated. Find an alternative.',
    from: {},
    to: {
      dependencyTypes: ['core'],
      path: ['^punycode$', '^domain$', '^constants$', '^sys$', '^async_hooks$', '^_linklist$', '^_stream_wrap$']
    }
  },
  {
    name: 'not-to-deprecated',
    severity: 'warn',
    comment: 'This module uses a (version of an) npm module that has been deprecated.',
    from: {},
    to: { dependencyTypes: ['deprecated'] }
  },
  {
    name: 'no-non-package-json',
    severity: 'error',
    comment:
      "This module depends on an npm package that isn't in the 'dependencies' section of package.json. " +
      'Fix it by adding the package to the dependencies.',
    from: {},
    to: { dependencyTypes: ['npm-no-pkg', 'npm-unknown'] }
  },
  {
    name: 'not-to-unresolvable',
    severity: 'error',
    comment: "This module depends on a module that cannot be resolved to disk.",
    from: {},
    to: { couldNotResolve: true }
  },
  {
    name: 'no-duplicate-dep-types',
    severity: 'warn',
    comment:
      "This module depends on an external package that occurs more than once in package.json " +
      '(e.g. both in devDependencies and in dependencies).',
    from: {},
    to: { moreThanOneDependencyType: true, dependencyTypesNot: ['type-only'] }
  },
  {
    name: 'not-to-spec',
    severity: 'error',
    comment:
      'This module depends on a spec (test) file. The sole responsibility of a spec file is to test code. ' +
      "If there's something in a spec that's of use to other modules, factor it out into a separate utility.",
    from: {},
    to: { path: SPEC_FILES }
  },
  {
    name: 'not-to-dev-dep',
    severity: 'error',
    comment:
      "This module depends on an npm package from the 'devDependencies' section of package.json, but it " +
      'looks like something that ships to production. Declare it in the "dependencies" section instead.',
    from: { path: '^src', pathNot: [SPEC_FILES] },
    to: {
      dependencyTypes: ['npm-dev'],
      dependencyTypesNot: ['type-only'],
      pathNot: ['node_modules/@types/']
    }
  }
];

const FORBIDDEN_CLI = [
  {
    name: 'no-other-dependencies-in-cli',
    comment:
      'Each folder inside `src/cli` is a primary entry point: a command of the CLI. Entry points wire concrete ' +
      'implementations onto the ports declared by features, so they may only depend on `src/features` for business ' +
      'capabilities, `src/libraries` for technical utilities, and `src/data` for static datasets.',
    severity: 'error',
    from: { path: '^src/cli' },
    to: {
      pathNot: [
        '^src/cli',
        '^src/features',
        '^src/libraries',
        '^src/data',
        '^src/common',
        '^node_modules/',
        '^assets/'
      ]
    }
  },
  {
    name: 'no-interdependencies-between-commands',
    comment:
      'Each command of the CLI is an isolated entry point. Commands must never depend on one another: anything ' +
      'they share belongs in `src/features` or `src/libraries`.',
    severity: 'error',
    from: { path: '^src/cli/([^/]+)/' },
    to: { path: '^src/cli/[^/]+/', pathNot: '^src/cli/$1/' }
  }
];

const FORBIDDEN_FEATURES = [
  {
    name: 'no-cli-dependencies-in-features',
    comment:
      'Features represent self-contained, business-oriented capabilities. They must never depend on the CLI. ' +
      '`src/cli` defines the command-line entry points, while `src/features` hosts the autonomous business capabilities.',
    severity: 'error',
    from: { path: '^src/features' },
    to: { path: '^src/cli' }
  },
  {
    name: 'no-interdependencies-between-features',
    comment:
      'Features must never depend on other features. When a feature needs a capability provided by another one, it ' +
      'declares a port in its own `keys` folder and the CLI entry point wires the concrete implementation in.',
    severity: 'error',
    from: { path: '^src/features/([^/]+)/' },
    to: { path: '^src/features/', pathNot: '^src/features/$1/' }
  },
  {
    name: 'no-interdependencies-between-abilities',
    comment:
      'An ability is a distinct, self-contained business behaviour within a feature. Abilities must never depend on ' +
      'other abilities of the same feature: what they share belongs to the feature domain.',
    severity: 'error',
    from: { path: '^src/features/([^/]+)/abilities/([^/]+)/' },
    to: { path: '^src/features/$1/abilities/', pathNot: '^src/features/$1/abilities/$2/' }
  },
  {
    name: 'no-dependencies-in-feature-domain',
    comment:
      'Domain code is the pure model of the problem a feature solves. It must stay free of infrastructure: no HTTP ' +
      'client, no file system, no CLI framework. It can only depend on itself and on technical libraries.',
    severity: 'error',
    from: { path: '^src/features/([^/]+)/domain', pathNot: SPEC_FILES },
    to: {
      pathNot: [
        '^src/features/$1/domain',
        '^src/libraries/',
        '^node_modules/@gouvfr-anct/',
        '^node_modules/@types/'
      ]
    }
  },
  {
    name: 'no-dependencies-in-ability-domain',
    comment:
      'Domain code of an ability is pure business logic. It can only depend on itself, on the domain of the feature ' +
      'it belongs to, and on technical libraries.',
    severity: 'error',
    from: { path: '^src/features/([^/]+)/abilities/([^/]+)/domain', pathNot: SPEC_FILES },
    to: {
      pathNot: [
        '^src/features/$1/abilities/$2/domain',
        '^src/features/$1/domain',
        '^src/libraries/',
        '^node_modules/@gouvfr-anct/',
        '^node_modules/@types/'
      ]
    }
  },
  {
    name: 'no-other-dependencies-than-domain-in-feature-keys',
    comment:
      "Keys are the isolated pivot between a feature's domain contracts and their concrete implementations: the " +
      'dedicated layer for dependency inversion. They can only depend on the domain they describe and on piqure.',
    severity: 'error',
    from: { path: '^src/features/([^/]+)/keys', pathNot: 'index[.]ts$' },
    to: {
      pathNot: [
        '^src/features/$1/domain',
        '^src/features/$1/keys',
        '^src/libraries/injection',
        '^node_modules/@gouvfr-anct/',
        '^node_modules/@types/'
      ]
    }
  },
  {
    name: 'no-other-dependencies-than-domain-in-ability-keys',
    comment:
      'Keys of an ability declare the ports that ability needs. They can only depend on the domain they describe and ' +
      'on piqure.',
    severity: 'error',
    from: { path: '^src/features/([^/]+)/abilities/([^/]+)/keys', pathNot: 'index[.]ts$' },
    to: {
      pathNot: [
        '^src/features/$1/abilities/$2/domain',
        '^src/features/$1/abilities/$2/keys',
        '^src/features/$1/domain',
        '^src/features/$1/keys',
        '^src/libraries/injection',
        '^node_modules/@gouvfr-anct/',
        '^node_modules/@types/'
      ]
    }
  },
  {
    name: 'no-other-dependencies-than-domain-in-feature-implementations',
    comment:
      'Implementations provide concrete realisations of the ports declared in `keys`. They can only depend on the ' +
      "feature's domain, on technical libraries, on static data and on npm packages.",
    severity: 'error',
    from: { path: '^src/features/([^/]+)/implementations/', pathNot: 'index[.]ts$' },
    to: {
      pathNot: [
        '^src/features/$1/domain',
        '^src/features/$1/keys',
        '^src/features/$1/implementations/',
        '^src/libraries/',
        '^src/data',
        '^node_modules/'
      ]
    }
  },
  {
    name: 'no-other-dependencies-than-domain-in-ability-implementations',
    comment:
      'Implementations of an ability provide concrete realisations of the ports it declares. They can only depend on ' +
      "the ability and feature domains, on technical libraries, on static data and on npm packages.",
    severity: 'error',
    from: { path: '^src/features/([^/]+)/abilities/([^/]+)/implementations/', pathNot: 'index[.]ts$' },
    to: {
      pathNot: [
        '^src/features/$1/abilities/$2/domain',
        '^src/features/$1/abilities/$2/keys',
        '^src/features/$1/abilities/$2/implementations/',
        '^src/features/$1/domain',
        '^src/features/$1/keys',
        '^src/libraries/',
        '^src/data',
        '^node_modules/'
      ]
    }
  }
];

// Each library may only depend on the libraries explicitly listed here.
const LIBRARY_DEPENDENCIES = {
  injection: [],
  http: [],
  'file-system': [],
  'mediation-numerique': ['file-system']
};

const libraryInterdependencyRules = () =>
  Object.entries(LIBRARY_DEPENDENCIES).map(([library, allowedDependencies]) => ({
    name: `library-${library}-allowed-deps`,
    comment: `Library '${library}' can only depend on: ${allowedDependencies.join(', ') || 'nothing'}.`,
    severity: 'error',
    from: { path: `^src/libraries/${library}/` },
    to: {
      path: '^src/libraries/',
      pathNot: [`^src/libraries/${library}/`, ...allowedDependencies.map((dependency) => `^src/libraries/${dependency}/`)]
    }
  }));

const undeclaredLibraryRule = () => ({
  name: 'no-undeclared-library-interdependencies',
  comment:
    'Libraries without declared dependencies cannot depend on other libraries. Add an entry to LIBRARY_DEPENDENCIES ' +
    'in .dependency-cruiser.cjs if the dependency is legitimate.',
  severity: 'error',
  from: {
    path: '^src/libraries/([^/]+)/',
    pathNot: Object.keys(LIBRARY_DEPENDENCIES).map((library) => `^src/libraries/${library}/`)
  },
  to: { path: '^src/libraries/', pathNot: ['^src/libraries/$1/'] }
});

const FORBIDDEN_LIBRARIES = [
  {
    name: 'no-cli-dependencies-in-libraries',
    comment: 'Libraries are generic technical utilities. They must never depend on the CLI entry points.',
    severity: 'error',
    from: { path: '^src/libraries' },
    to: { path: '^src/cli' }
  },
  {
    name: 'no-features-dependencies-in-libraries',
    comment: 'Libraries are generic technical utilities. They must never depend on business features.',
    severity: 'error',
    from: { path: '^src/libraries', pathNot: [SPEC_FILES] },
    to: { path: '^src/features' }
  },
  ...libraryInterdependencyRules(),
  undeclaredLibraryRule()
];

module.exports = {
  forbidden: [...FORBIDDEN_GLOBAL, ...FORBIDDEN_CLI, ...FORBIDDEN_FEATURES, ...FORBIDDEN_LIBRARIES],
  options: {
    doNotFollow: { path: ['node_modules'] },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default', 'types'],
      mainFields: ['module', 'main', 'types', 'typings']
    },
    skipAnalysisNotInRules: true,
    reporterOptions: {
      dot: { collapsePattern: 'node_modules/(?:@[^/]+/[^/]+|[^/]+)' },
      archi: { collapsePattern: '^(?:src)/[^/]+|node_modules/(?:@[^/]+/[^/]+|[^/]+)' },
      text: { highlightFocused: true }
    }
  }
};
