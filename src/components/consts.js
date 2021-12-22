export const textDescriptions = {
    "registration": {
        title: "Registration",
        content: ["To register, a client generates many public/private keypairs", "These keypairs are given names: one identity key, some signed prekeys, and many onetime prekeys",
            "The client sends the public keys to the Signal server, who stores them alongside the client's ID"],
    },
    "chainKey": {
        title: "Chain Key",
        content: ["Each chain has a growing list of chain keys",
            "Every new chain key is created from the previous one using a Key Derivation Function (KDF)",
            "Each KDF creates a new a message key as well"],
    },
    "messageKey": {
        title: "Message Key",
        content: ["The clients use message keys to encrypt and decrypt messages",
            "One message key will be used to encrypt/decrypt one message",
            "Client derive message keys from chain keys"],
    },
    "session": {
        title: "Session",
        content: ["Sessions are stateful data structures that clients use to keep the secret info when talking to each other",
            "A session consists of an ordered list of Ratchets; each ratchet derives at most one Chain"],
    },
    "ratchet": {
        title: "Ratchet",
        content: ["A ratchet consists of a rootkey, a remote ephemeral public key, and a local ephemeral keypair",
            "The client generates the local ephemeral keypair from random",
            "The initial rootkey is an outpu of X3DH ",
            "Then, the rootkey updates itself by taking into entropy from the remote and local ephemeral keys"],
    },
    "x3dh": {
        title: "X3DH",
        content: ["X3DH is a procedure which involves running Diffie-Hellman key exchange 3 times and concatenating the result",
            "Clients perform X3DH to create sessions with one another",
            "When ran as the initiating party, X3DH takes a prekey bundle obtained from the Signal server, and a locally generated keypair",
            "Client uses the output of X3DH to derive the first rootkey, which becomes a part of the first ratchet"],
    },

    "baseKey": {
        title: "Basekey",
        content: ["The basekey is the public key of a keypair that a client generates when running X3DH as initializer",
            "The client then include the basekey in each prekey message.",
            "The receiver of the prekey message uses the basekey as input into its X3DH step"],
    },

    "chain": {
        title: "Chain",
        content: ["A chain is a list of chain keys; each chain key derives a message key except the last one",
            "There are two types of chains: sending and receiving",
            "The chain type alternates: if a chain is sending, then the next chain is receiving",
            "The chain type also flips on the other client: a sending chain for Alice is a receiving chain for Bob",
            "When decrypting a message, a client uses some metadata from the message to identify which receiving chain to use"],
    },

    "rootKey": {
        title: "Rootkey",
        content: ["Important invariant: the rootkeys are always the same in the two client's sessions",
            "The first rootkeys are the same due to X3DH",
            "The client derives each new rootkey using a Key Derivation Function (KDF)",
            "The KDF combines the entropy of the current rootkey, plus additional entropy from a Diffie-Hellman",
            "The additioanl Diffie-Hellman uses a fresh ephemeral private key that the client generates locally, and a remote public key from the other client",
            "This process updates the rootkey and generates a chain key."],
    },

    "preKeyMessage": {
        title: "Prekey Message",
        content: ["Signal has two types of messages: prekey Message and normal Message",
            "Client sends a prekey message when the recipient does not have a session yet.",
            "A prekey message is a whisperMessage plus several additional pieces of data",
            "the sender's identity public key, sender's ephemeral public key, and the id of receiver's signed prekey"],
    },

    "normalMessage": {
        title: "Normal Message",
        content: ["A normal signal message consists of a ciphertext, a counter, and an ephemeral public key",
            "the ciphertext comes from encrypting the plaintext with a messageKey",
            "the counter denotes the location of the message key in its chain",
            "the ephemeral public key is used to identify which chain is used to encrypt this message, and for receiver to perform Diffie-Hellman to reconstruct that chain"],
    },

    "encryption": {
        title: "Encryption",
        content: ["When encrypting a message, a client will derive a message from the newest sending chain"],
    },


    "decryptPrekeyMessage": {
        title: "Decrypting a Prekey Message",
        content: ["Upon getting a prekey message, the receiver creates a session",
            "First, it parses out an identity pulic key and an ephemeral public key from the message, and performs an X3DH.",
            "Then, from the X3DH result the receiver derives its first rootKey.",
            "The rest of decryption is the same as decrypting a normal message"],
    },

    "decryptNormalMessage": {
        title: "Decrypting a Normal Message",
        content: ["The receiver first parses out an ephemeral public key from the message",
            "Then, it uses the public key to locate a receiving chain, and move the chain forward to generate message keys",
            "Finally, the receiver uses the generated message keys to decrypt the message"],
    },

    "identityKey": {
        title: "Identity Key",
        content: ["Identity key is a long term public/private keypair which represents the client's identity. ",
            "The Signal server stores each client's identity public key",
            "The client stores its own identity private key."],
    },
    "preKeyBundle": {
        title: "Prekey Bundle",
        content: ["A prekey bundle is a set of public keys generated by a client and sent to the Signal server",
            "If Alice wants to chat with Bob, she will first download Bob's prekey bundle.",
            "A prekey bundle contains an identity (public) key, a signed prekey, and (optiionally) a one-time prekey"]
    },
}

const spacing = 300;

export const graphDefs = {
    "registration": {
        nodes: [
            { id: 'node-1', content: 'Old Chain Key', coordinates: [250, 60], },
            { id: 'node-2', content: 'KDF', coordinates: [250, 200], },
            { id: 'node-3', content: 'Message Key', coordinates: [350, 200], },
            { id: 'node-4', content: 'New Chain Key', coordinates: [250, 320], },
        ],
        links: [
            { input: 'node-1', output: 'node-2' },
            { input: 'node-2', output: 'node-3' },
            { input: 'node-2', output: 'node-4' },
        ]
    },
    "x3dh": {
        nodes: [
            { id: 'node-their-1', content: 'their public identity key', coordinates: [0, 0], },
            { id: 'node-their-2', content: 'their public signed prekey ', coordinates: [spacing, 0], },
            { id: 'node-ours-1', content: 'our ephemeral private key', coordinates: [100, 200], },
            { id: 'node-ours-2', content: 'our identity private key', coordinates: [100 + spacing, 200], },
        ],
        links: [
            { input: 'node-their-1', output: 'node-ours-1' },
            { input: 'node-their-2', output: 'node-ours-1' },
            { input: 'node-their-2', output: 'node-ours-2' },
        ]
    },
    "session": {
        nodes: [
            { id: 'ratchet-1', content: 'Ratchet_1', coordinates: [250, 0], },
            { id: 'ratchet-2', content: 'Ratchet_2', coordinates: [250, 100], },
            { id: 'ratchet-3', content: 'Ratchet_3', coordinates: [250, 200], },
            { id: 'ratchet-4', content: 'Ratchet_4', coordinates: [250, 300], },
            { id: 'chain-1', content: 'Chain_1', coordinates: [400, 20], },
            { id: 'chain-2', content: 'Chain_2', coordinates: [400, 120], },
            { id: 'chain-3', content: 'Chain_3', coordinates: [400, 220], },
        ],
        links: [
            { input: 'ratchet-1', output: 'ratchet-2' },
            { input: 'ratchet-2', output: 'ratchet-3' },
            { input: 'ratchet-3', output: 'ratchet-4' },
            { input: 'ratchet-1', output: 'chain-1' },
            { input: 'ratchet-2', output: 'chain-2' },
            { input: 'ratchet-3', output: 'chain-3' },
        ]
    },
    "chainKey": {
        nodes: [
            { id: 'node-1', content: 'Old Chain Key', coordinates: [250, 60], },
            { id: 'node-2', content: 'KDF', coordinates: [250, 200], },
            { id: 'node-3', content: 'Message Key', coordinates: [350, 200], },
            { id: 'node-4', content: 'New Chain Key', coordinates: [250, 320], },
        ],
        links: [
            { input: 'node-1', output: 'node-2' },
            { input: 'node-2', output: 'node-3' },
            { input: 'node-2', output: 'node-4' },
        ]
    },
    "chain": {
        nodes: [
            { id: 'chainKey-1', content: 'chainKey_1', coordinates: [0, 0], },
            { id: 'chainKey-2', content: 'chainKey_2', coordinates: [spacing, 0], },
            { id: 'chainKey-3', content: 'chainKey_3', coordinates: [spacing * 2, 0], },
            { id: 'chainKey-4', content: 'chainKey_4', coordinates: [spacing * 3, 0], },
            { id: 'messageKey-1', content: 'messageKey_1', coordinates: [spacing / 2, 200], },
            { id: 'messageKey-2', content: 'messageKey_2', coordinates: [spacing / 2 + spacing, 200], },
            { id: 'messageKey-3', content: 'messageKey_3', coordinates: [spacing / 2 + spacing * 2, 200], },
        ],
        links: [
            { input: 'chainKey-1', output: 'chainKey-2' },
            { input: 'chainKey-2', output: 'chainKey-3' },
            { input: 'chainKey-3', output: 'chainKey-4' },
            { input: 'chainKey-1', output: 'messageKey-1' },
            { input: 'chainKey-2', output: 'messageKey-2' },
            { input: 'chainKey-3', output: 'messageKey-3' },
        ]
    },
    "rootKey": {
        nodes: [
            { id: 'rootKey-1', content: 'rootKey_1', coordinates: [200, 200], },
            { id: 'kdf', content: 'KDF', coordinates: [200 + spacing, 200], },
            { id: 'rootKey-2', content: 'rootKey_2', coordinates: [200 + 2 * spacing, 100], },
            { id: 'chainKey-1', content: 'chainKey_1', coordinates: [200 + 2 * spacing, 300], },
        ],
        links: [
            { input: 'rootKey-1', output: 'kdf' },
            { input: 'kdf', output: 'chainKey-1' },
            { input: 'kdf', output: 'rootKey-2' },
        ]
    }
}