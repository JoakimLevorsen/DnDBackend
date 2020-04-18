namespace dungeons {
    public sealed class ClientIdAssigner {
        private int nextId;

        private ClientIdAssigner() {
            nextId = 0;
        }

        private static ClientIdAssigner? sharedInstance;
        private static readonly object instanceLock = new object();

        public static ClientIdAssigner GetInstance() {
            if (sharedInstance == null) {
                lock(instanceLock) {
                    if (sharedInstance == null) {
                        sharedInstance = new ClientIdAssigner();
                    }
                }
            }
            return sharedInstance;
        }

        private static readonly object idLock = new object();
        public int GetId() {
            int id;
            lock(idLock) {
                id = ++nextId;
            }
            return id;
        }
    }
}